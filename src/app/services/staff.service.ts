import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor() { }

  genTimeStamp(): number {
    let d = new Date();
    return d.getTime();
  }
  private compareValuesOfArray(key, order = 'asc') {
    return function(a, b) {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // nếu không tồn tại
        return 0;
      }

      const varA = (typeof a[key] === 'string') ?
      a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ?
        b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );
    };
  }
  caculateTurnMinMax(staffCheckIn){
    let turnMin ,turnMax;
    if(staffCheckIn.length > 0){
      for(let nhanVien of staffCheckIn){
        if(nhanVien.timecheckIn > 0){
          if(turnMin){
            if(nhanVien.turn < turnMin){
              turnMin = nhanVien.turn;
            }
          }else{
            turnMin = nhanVien.turn;
          }
          if(turnMax){
            if(nhanVien.turn > turnMax){
              turnMax = nhanVien.turn;
            }
          }else{
            turnMax = nhanVien.turn;
          }
        }
      }
    }else{
      turnMin = 0;
      turnMax = 0;
    }
    return [turnMin, turnMax];
  }
  caculatePrioritize(turnMin, turnMax, staffCheckIn){
    let nvs = [];
    if(staffCheckIn.length > 0){
      let cloneNhanViens = [...staffCheckIn];
      cloneNhanViens.sort(this.compareValuesOfArray('turn'));
      for(let i=turnMin; i<= turnMax; i++){
        let arrTurn = [];
        for(let nv of cloneNhanViens){
          if(nv.turn == i) arrTurn.push(nv);
        }
        arrTurn.sort(this.compareValuesOfArray('timecheckIn'));
        nvs = nvs.concat(arrTurn);
      }
      nvs = nvs.map(s => {return {
        id: s.id,
        prioritize: nvs.indexOf(s) + 1
      }});
    }
    return nvs;
  }
}
