import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PokemonListComponent } from "../../pokemon/components/pokemon-lis.component/pokemon-list.component";
import { PokemonListSkeleton } from "./ui/pokemon-list-skeleton/pokemon-list-skeleton";
import { PokemonService } from '../../pokemon/services/pokemon.service';
import { Pokemon } from '../../pokemon/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemon-page.component',
  imports: [PokemonListComponent, PokemonListSkeleton],
  templateUrl: './pokemon-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonPageComponent implements OnInit {

  private pokemonService = inject(PokemonService);
  public pokemon = signal<Pokemon[]>([]);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);

  public currentPage = toSignal<number>(
    this.route.queryParamMap.pipe(
      map(params => params.get('page') ?? '1'),
      map(page => (isNaN(+page) ? 1 : +page)),
      map(page => Math.max(1, page))
    )
  );


  ngOnInit(): void {
    this.loadPokemon();
  }
  public loadPokemon(page = 0) {

    const pageToLoad = this.currentPage()! + page;

    this.pokemonService.loadPage(pageToLoad)
      .pipe(
        tap(() => this.router.navigate([], { queryParams: { page: pageToLoad } })),
        tap(() => this.title.setTitle(`Pokemon SSR - Page ${pageToLoad}`))
      )
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);
      })
  }
}
