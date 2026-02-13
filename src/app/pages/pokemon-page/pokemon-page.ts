import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PokemonByID } from '../../pokemon/interfaces';
import { PokemonService } from '../../pokemon/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemon-page',
  imports: [],
  templateUrl: './pokemon-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonPage implements OnInit {

  private pokemonService = inject(PokemonService);
  private activatedRoute = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta)

  public pokemonApi = signal<PokemonByID | null>(null);

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    if (!id) return;

    this.pokemonService.loadPokemon(id)
      .pipe(
        tap(({ name, id }) => {

          const pageTitle = `#${id} ${name}`
          const pageDescription = `Página del Pokámon ${name}`
          this.title.setTitle(pageTitle);

          this.meta.updateTag({ name: 'description', content: pageDescription })
          this.meta.updateTag({ name: 'og:description', content: pageDescription })
          this.meta.updateTag({ name: 'og:title', content: pageTitle })
          this.meta.updateTag({
            name: 'og:image',
            content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` })
        })
      )
      .subscribe(this.pokemonApi.set);
  }
}
