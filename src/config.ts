export interface NavItem {
  label: string
  icon: string
  to?: string
  href?: string
}

export interface SocialItem {
  label: string
  href: string
  icon: string
}

export const site = {
  brand: 'hongye',
  title: "hongye's Blog",
  taglines: [
    '活着最大的乐趣, 就在于可以看到变数',
    'Read(); Think(); Try(); Repeat();',
  ],
  copyright: '© 2026. All rights reserved.',
  nav: [
    { label: 'Home', to: '/', icon: 'home' },
    { label: 'Resources', to: '/resources', icon: 'archive' },
    { label: 'Friends', to: '/friends', icon: 'users' },
    { label: 'About', to: '/about', icon: 'user' },
    { label: 'Resume', href: 'https://docs.google.com/document/d/1g6rFkIBUW2a7zAXWrMma7KrQGBwZQ0GU0n_S09rm7I0/edit?tab=t.0', icon: 'file' },
  ] as NavItem[],
  social: [
    { label: 'Email', href: 'mailto:khoryz666@gmail.com', icon: 'envelope' },
    { label: 'Discord', href: 'https://discordapp.com/users/759381914548568094', icon: 'discord' },
    { label: 'GitHub', href: 'https://github.com/khoryz666', icon: 'github' },
  ] as SocialItem[],
}
