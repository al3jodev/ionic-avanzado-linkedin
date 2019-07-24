import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';

/*
  Generated class for the BbddServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BbddServiceProvider {
  db:SQLiteObject = null;

  constructor(private sQLite:SQLite,
              private storage:Storage) {
    console.log('Hello BbddServiceProvider Provider');
  }

  initDatabase(){
    this.sQLite.create({
      name: "data.db",
      location: "default"
    })
      .then(
        (data)=>{
          console.log("Base de datos disponible");
          this.db = data;
          this.storage.get("dbExists")
            .then((value)=>{
              if(value == null){
                console.log("No existe la variable");
                this.createTable()
                  .then(
                    (datal)=>{
                      console.log("Tabla creada");
                      this.storage.set("dbExists", "1")
                        .then(()=>{
                          console.log("Variable añadida");
                        })
                    }
                  )
                  .catch((error)=>{
                    console.log("Error añadiendo tabla a la base de datos");
                  })

              }else{
                console.log("Existe la variable " + value);
              }
            })

        }
      )
      .catch((error)=>{
        console.log("Error abriendo base de datos");
      })
  }

  createTable(){
    let sql = "CREATE TABLE IF NOT EXISTS people(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)";
    return this.db.executeSql(sql, []);
  }

  insert(people:any){
    let sql = "INSERT INTO people(name, age) VALUES(?,?)";
    return this.db.executeSql(sql, [people.name, people.age])
  }

  getAll(){
    let sql = " SELECT * FROM people";
    return this.db.executeSql(sql, [])
      .then(
        response =>{
          let people = [];
          for(let index=0; index<response.rows.length; index++){
            people.push(response.rows.item(index));
          }
          return Promise.resolve(people);
        }
      )
      .catch(
        error=> Promise.reject(error)
      )
  }

  delete(id:any){
    let sql = "DELETE FROM people WHERE id=?";
    return this.db.executeSql(sql, [id])
  }

  update(people:any){
    let sql = "UPDATE people SET name=?, age=? WHERE id=?";
    return this.db.executeSql(sql, [people.name, people.age, people.id])
  }
}
