import { Component, OnInit } from '@angular/core';
import { PokedexService } from './pokedex.service';
import { cloneDeep, filter, find } from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private pokedexService: PokedexService, private notification: NzNotificationService) { }
  title = 'pokedex';
  public pokemonList: any[] = [];
  public searchPokemonList: any[] = [];
  public searchValue: string = "";
  public isVisible = false;
  public evolutionData: any;
  public clickedPokemonData: any;
  public habitatDetails: any;
  public charteristicDescription: any;
  public totalElements!: number;
  public page = 1;
  public size = 10;
  public isSpinning = false;

  ngOnInit(): void {
    this.isSpinning = true;
    this.pokedexService.getAllPokemonForSearch().subscribe((res: any) => {
      this.pokemonList = res.results;
      this.getPokemonData();
    })

  }

  getPokemonData(size?: number, offset?: number) {
    this.isSpinning = true;
    this.searchValue = "";
    this.searchPokemonList = [];
    this.pokedexService.getPokemonDetails(size, offset).subscribe((res: any) => {
      this.totalElements = res.count;
      res.results.forEach((result: any) => {
        this.pokedexService.getIndividualPokemonDetails(result.name).subscribe((individualData: any) => {
          this.searchPokemonList.push(individualData);
        })
        this.searchPokemonList = cloneDeep(this.searchPokemonList);
      })
      this.isSpinning = false;
    })
  }
  viewModalOpener(data: any) {
    this.getEvolutionAndData(data);
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.isSpinning = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isSpinning = false;
  }

  searchPokemon() {
    if (this.searchValue?.length > 0) {
      this.isSpinning = true;
      const foundPokemon: any[] = filter(this.pokemonList, (res: any) => {
        return res.name.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase())
      })
      if (foundPokemon?.length > 0) {
        this.searchPokemonList = [];
        foundPokemon.forEach((poke: any) => {
          this.pokedexService.getIndividualPokemonDetails(poke.name).subscribe((individualData: any) => {
            this.searchPokemonList.push(individualData);
            this.searchPokemonList = cloneDeep(this.searchPokemonList);
            this.totalElements = this.searchPokemonList?.length;
          })
        })

      } else {
        this.notification.error(
          'No Data',
          'Sorry, No Pokemon found',
          { nzPlacement: "top" }
        );
      }
      this.isSpinning = false;
    } else {
      this.getPokemonData();
    }
  }


  getEvolutionAndData(data: any) {
    this.isSpinning = true;
    forkJoin(this.pokedexService.getIndividualPokemonDetails(data.name),
      this.pokedexService.getEvolutionById(data.id),
      this.pokedexService.getHabitatDetailsById(data.id), this.pokedexService.getHabitatCharateristicsById(data.id)).subscribe((results: any) => {
        this.clickedPokemonData = results[0];
        this.evolutionData = results[1];
        this.habitatDetails = results[2];
        results[3].descriptions.forEach((desc: any) => {
          if (desc?.language?.name === "en") {
            this.charteristicDescription = desc.description
          }
        })
        this.isVisible = true;
        this.isSpinning = false;
      }, (error: any) => {
        this.isSpinning = false;
        this.isVisible = false;
        this.notification.error(
          'No Information',
          'Sorry No Information Present for this Pokemon',
          { nzPlacement: "top" }
        );
      })
  }

  capitalizeFirstLetter(str: string): string {
    return str?.slice(0, 1)?.toUpperCase() + str?.slice(1);
  }

  onPageIndexChange(data: number) {
    const offSet = data * 10;
    this.getPokemonData(this.size, offSet)
  }

  createBasicNotification(): void {

  }
}
