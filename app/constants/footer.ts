import { FooterLink } from "../types";

export const FOOTER_LINKS: FooterLink[] = [
  {
    name: 'LinkedIn',
    hoverText: 'Connect with me',
    icon: 'icons/linkedin.svg',
    url: 'https://www.linkedin.com/in/paul-zabotto-024aba220',
  },
  {
    name: 'World Map',
    hoverText: 'Countries I\'ve visited',
    icon: 'icons/github.svg', // TODO: Replace with a globe/map icon when available
    url: '#', // TODO: Add world map project URL when ready
  },
  {
    name: 'Instagram',
    hoverText: '@paul.zbtt',
    icon: 'icons/instagram.svg',
    url: 'https://www.instagram.com/paul.zbtt/',
  },
  {
    name: 'Resume',
    hoverText: 'Download',
    icon: 'icons/file.svg',
    url: './Resume-PZ.pdf',
  },
  {
    name: 'Dreams',
    hoverText: 'Mon Ciel des Rêves',
    icon: 'icons/star.svg',
    url: '/reves',
  },
];
