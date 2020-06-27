import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  nhanViens = [
    {id:1,name:'Nguyen A', checkIn: false, turn: 0, timecheckIn:0,prioritize:0},
    {id:2,name:'Nguyen B', checkIn: false, turn: 0, timecheckIn:0,prioritize:0},
    {id:3,name:'Nguyen C', checkIn: false, turn: 0, timecheckIn:0,prioritize:0}
  ];
  khachHangs = [];
  nhanVienCheckIn = [];
  idKhachHang = 0;
  idNhanVien = 3;
  isAddKh: boolean;
  title = 'phuong-an-vong-tron';
  nhanVienChon: any;
  isNhanVienChon: boolean;
  themKhachHang(){
    if(this.nhanVienCheckIn.length > 0){
      this.isAddKh = false;
      this.isNhanVienChon = true;
      this.nhanVienChon = this.caculateNhanVienAddTurn();
      for(let nhanVien of this.nhanViens){
        if(nhanVien.id == this.nhanVienChon.id) {
          nhanVien.turn += 1;
          this.idKhachHang += 1;
          this.khachHangs.push({id:this.idKhachHang, name: 'Khach Hang ' + this.idKhachHang});
          break;
        }
      }
    }else{
      this.isAddKh = true;
    }
  }
  goiy(){
    if(this.nhanVienCheckIn.length > 0){
      this.isAddKh = false;
      this.isNhanVienChon = true;
      this.nhanVienChon = this.caculateNhanVienAddTurn();
      this.idKhachHang += 1;
      this.khachHangs.push({id:this.idKhachHang, name: 'Khach Hang ' + this.idKhachHang});
    }else{
      this.isAddKh = true;
    }
  }
  checkInNhanVien(id){
    for(let nhanVien of this.nhanViens){
      if(nhanVien.id == id){
        if(nhanVien.checkIn == false){
          nhanVien.checkIn = true;
          nhanVien.timecheckIn = this.genTimeStamp();
          this.nhanVienCheckIn.push(nhanVien);
        }else{
          nhanVien.checkIn = false;
          nhanVien.timecheckIn = 0;
          this.nhanVienCheckIn = this.nhanVienCheckIn.filter(nv => nv.id !== id);
        }
      }
    }
  }
  genTimeStamp(): number {
    let d = new Date();
    return d.getTime();
  }
  caculateNhanVienAddTurn(){
    let nhanVienAddTurn, turnMin,turnMax, timecheckInMin;
    for(let nhanVien of this.nhanVienCheckIn){
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
    this.addPrioritize(turnMin, turnMax);
    let nhanVienTurnMin = this.nhanVienCheckIn.filter(nv => nv.turn == turnMin && nv.timecheckIn > 0);
    if(nhanVienTurnMin.length == 1){
      nhanVienAddTurn = nhanVienTurnMin[0];
    }else{
      for(let nhanVien of nhanVienTurnMin){
        if(timecheckInMin){
          if(nhanVien.timecheckIn < timecheckInMin) timecheckInMin = nhanVien.timecheckIn;
        }else{
          timecheckInMin = nhanVien.timecheckIn;
        }
      }
      nhanVienAddTurn = this.nhanVienCheckIn.filter(nv => nv.timecheckIn == timecheckInMin)[0];
    }
    return nhanVienAddTurn;
  }
  changeTurn(id, type){
    for(let nhanVien of this.nhanViens){
      if(nhanVien.id == id){
        if(type == 'add') nhanVien.turn = nhanVien.turn == 0 ? 1 : nhanVien.turn + 1;
        else if(type == 'delete') nhanVien.turn = nhanVien.turn == 0 ? 0 : nhanVien.turn - 1;
      }
    }
  }
  themNhanVien(){
    this.idNhanVien += 1;
    this.nhanViens.push({id:this.idNhanVien,name:'Nhan Vien' + this.idNhanVien, checkIn: false, turn: 0, timecheckIn:0, prioritize: 0});
  }
  addPrioritize(turnMin, turnMax){
    let cloneNhanViens = [...this.nhanVienCheckIn];
    let nvs = [];
    cloneNhanViens.sort(this.compareValues('turn'));
    for(let i=turnMin; i<= turnMax; i++){
      let arrTurn = [];
      for(let nv of cloneNhanViens){
        if(nv.turn == i) arrTurn.push(nv);
      }
      arrTurn.sort(this.compareValues('timecheckIn'));
      nvs = nvs.concat(arrTurn);
    }
    nvs = nvs.map(s => {return {
      id: s.id,
      prioritize: nvs.indexOf(s) + 1
    }});
    for(let nv of nvs){
      for(let nhanvien of this.nhanViens){
        if(nhanvien.id == nv.id) nhanvien = Object.assign(nhanvien, nv);
      }
    }
  }
  compareValues(key, order = 'asc') {
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
}
