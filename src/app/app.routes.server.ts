import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pokemon/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Prerenderizar los primeros 151 pokémon (primera generación)
      const ids = Array.from({ length: 151 }, (_, i) => ({ id: `${i + 1}` }));
      return ids;
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
