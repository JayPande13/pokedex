import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {

  apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemonDetails(size = 10, offset = 0): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/?limit=${size}&offset=${offset}`);
  }
  getAllPokemonForSearch(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/?limit=5000&offset=0`);
  }

  getIndividualPokemonDetails(name: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${name}`);
  }

  getEvolutionById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
  }

  getHabitatDetailsById(id: number) {
    return this.http.get<any[]>(`https://pokeapi.co/api/v2/pokemon-habitat/${id}`);
  }

  getHabitatCharateristicsById(id: number) {
    return this.http.get<any[]>(`https://pokeapi.co/api/v2/characteristic/${id}`);
  }
}
