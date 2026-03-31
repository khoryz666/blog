# Implementation Plan

I plan to implement my blog using Cloudflare pages, along with (zola)[https://github.com/getzola/zola] and definitely a minimalistic theme.

I am tired of AI shit (it disrupts my capability to read and improve)

Hence there will be no AI-generated content in my blog.

See you in 3 days later~

*hongyeblogspace.uk is my previous site (built with (NotionNext)[https://docs.tangly1024.com/about]), which is deprecated*

I appreciate the previous blog but it is too much of bloat. Now let me build this myself with a larger proportion of self-involvement, at least building the frontend and structure the deployment myself.

let me get through the data flow logic first



there are three entities basically (my computer (git repo), github repo, cloudflare)

from my computer, i save markdown posts, then deploy it to github

using github action, my zola engine helps me to convert md posts to html/css/js

then github trigger cloudflare to take the html/css/js, then cloudflare distribute my files worldwide (what happening here is not important, it is a blackbox for me)





throughout this session, i will learn

1. how to configure custom domain to cloudflare pages

2. how to configure a static site generator (convert md to html/css/js)
Steps:
I install zola in my computer first (depends on which system you are on, `scoop install zola` / `sudo pacman -S zola`)
2026-03-31 : gone through https://www.getzola.org/documentation/getting-started/overview/ and deploy it on cloudflare (~2 hr)

3. how to configure github action to auto build md files once deployed

4. how to get myself a cloudflare website, totally free

5. how to structure my blog directory (git repo)
