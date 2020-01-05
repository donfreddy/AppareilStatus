import { Subject } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class AppareilService implements OnInit {
  


  appareilSubject = new Subject<any[]>();
  
  private appareils = [];
  
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  emitAppareilSubject(){

    this.appareilSubject.next(this.appareils.slice());
  }

  getAppareilById(id: number){
    const appareil = this.appareils.find(
      (appareilObject) => {
        return appareilObject.id === id;
      }
    );
    return appareil;
  }

  switchOnAll() {
    for (const appareil of this.appareils) {
      appareil.status = 'allume'
    }
    this.emitAppareilSubject();
  }

  switchOffAll() {
    for (const appareil of this.appareils) {
      appareil.status = 'eteint'
    }
    this.emitAppareilSubject();
  }

  switchOnOne(index: number){
    this.appareils[index].status = 'allume'
    this.emitAppareilSubject();
  }

  switchOffOne(index: number){
    this.appareils[index].status = 'eteint'
    this.emitAppareilSubject();
  }

  addAppareil(name: string, status: string) {
    const appareilObject = {
      id: 0,
      name: '',
      status: ''
    };
    appareilObject.name = name;
    appareilObject.status = status;
    appareilObject.id = this.appareils[(this.appareils.length - 1)].id + 1;

    this.appareils.push(appareilObject);
    this.emitAppareilSubject();
  }

  saveAppareilsToServer() {
    this.httpClient
      .put('https://statappareil.firebaseio.com/appareils.json', this.appareils)
      .subscribe(
        () => {
          console.log('Enregistrement terminé !');
        },
        (error) => {
          console.log('Erreur de sauvegarde !');
        }
      );
  }

  getAppareilsFromServer() {
    this.httpClient
      .get<any>('https://statappareil.firebaseio.com/appareils.json')
      .subscribe(
        (res) => {
          this.appareils = res;
          this.emitAppareilSubject();
        },
        (error) => {
          console.log('Erreur de chargement ! ' + error);
        }
      );
  }

}