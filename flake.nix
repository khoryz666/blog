{
  description = "A Hugo + PaperMod blog";

  # Every dependency is pinned in flake.lock; `nix flake update` bumps them all.
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    papermod = {
      url = "github:adityatelange/hugo-PaperMod";
      flake = false;
    };
    # The Obsidian Git plugin's release files, committed under .obsidian/ by `nix run .#obsidian-plugins`.
    obsidian-git-main = {
      url = "file+https://github.com/Vinzent03/obsidian-git/releases/latest/download/main.js";
      flake = false;
    };
    obsidian-git-manifest = {
      url = "file+https://github.com/Vinzent03/obsidian-git/releases/latest/download/manifest.json";
      flake = false;
    };
    obsidian-git-styles = {
      url = "file+https://github.com/Vinzent03/obsidian-git/releases/latest/download/styles.css";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, papermod, ... }@inputs:
    let
      forAllSystems = f:
        nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ]
          (system: f nixpkgs.legacyPackages.${system});

      # Hugo looks a theme up by directory name, so expose PaperMod as themes/PaperMod.
      themesDir = pkgs: pkgs.linkFarm "hugo-themes" [ { name = "PaperMod"; path = papermod; } ];
    in
    {
      packages = forAllSystems (pkgs: {
        # `nix build` renders the site into ./result.
        default = pkgs.stdenvNoCC.mkDerivation {
          name = "blog";
          src = self;
          nativeBuildInputs = [ pkgs.hugo ];
          buildPhase = ''
            hugo build --minify --panicOnWarning \
              --themesDir ${themesDir pkgs} \
              --cacheDir "$TMPDIR/hugo-cache" \
              --destination "$out"
          '';
          dontInstall = true;
        };

        obsidian-plugins = pkgs.writeShellApplication {
          name = "obsidian-plugins";
          text = ''
            dir=.obsidian/plugins/obsidian-git
            mkdir -p "$dir"
            install -m 644 ${inputs.obsidian-git-main} "$dir/main.js"
            install -m 644 ${inputs.obsidian-git-manifest} "$dir/manifest.json"
            install -m 644 ${inputs.obsidian-git-styles} "$dir/styles.css"
          '';
        };
      });

      devShells = forAllSystems (pkgs: {
        # `nix develop` (or direnv) gives you the same Hugo and theme for `hugo server`.
        default = pkgs.mkShell {
          packages = [ pkgs.hugo ];
          HUGO_THEMESDIR = themesDir pkgs;
        };
      });
    };
}
