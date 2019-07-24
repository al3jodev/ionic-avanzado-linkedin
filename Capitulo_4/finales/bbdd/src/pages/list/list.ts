import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BbddServiceProvider } from "../../providers/bbdd-service/bbdd-service";


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  people;

  constructor(public navCtrl: NavController,
              private bbddServiceProvider:BbddServiceProvider) {

  }

  ionViewWillEnter(){
    this.loadData();
  }

  loadData(){
    this.bbddServiceProvider.getAll()
      .then(
        lista =>{
          this.people = lista;
        }
      )
  }

  delete(id){
    this.bbddServiceProvider.delete(id)
      .then(
        (data)=>{
          this.loadData();
        }
      )
      .catch(
        (err)=>{
          console.log(err);
        }
      )
  }

}
