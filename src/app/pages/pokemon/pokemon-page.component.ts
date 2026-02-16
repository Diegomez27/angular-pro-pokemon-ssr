import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { PokemonListComponent } from "../../pokemon/components/pokemon-lis.component/pokemon-list.component";
import { PokemonListSkeleton } from "./ui/pokemon-list-skeleton/pokemon-list-skeleton";
import { PokemonService } from '../../pokemon/services/pokemon.service';
import { Pokemon } from '../../pokemon/interfaces';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemon-page.component',
  imports: [PokemonListComponent, PokemonListSkeleton, RouterLink],
  templateUrl: './pokemon-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonPageComponent {

  private pokemonService = inject(PokemonService);
  public pokemon = signal<Pokemon[]>([]);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);

  public currentPage = toSignal<number>(
    this.route.params.pipe(
      map(params => params['page'] ?? '1'),
      map(page => (isNaN(+page) ? 1 : +page)),
      map(page => Math.max(1, page))
    )
  );

  public loadOnPageChanfed = effect(() => {
    this.loadPokemon(this.currentPage());
  });


  // ngOnInit(): void {
  //   this.loadPokemon();
  // }

  public loadPokemon(page = 0) {
    this.pokemonService
      .loadPage(page)
      .pipe(
        tap(() => this.title.setTitle(`Pokemon SSR - Page ${page}`))
      )
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);
      })
  }
}
