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
      let nhanVienAddTurnId = this.caculateNhanVienAddTurn();
      for(let nhanVien of this.nhanViens){
        if(nhanVien.id == nhanVienAddTurnId) {
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
          this.nhanVienCheckIn = this.nhanVienCheckIn.filter(nv => nv.id == id);
        }
      }
    }
  }
  genTimeStamp(): number {
    let d = new Date();
    return d.getTime();
  }
  caculateNhanVienAddTurn(){
    let nhanVienAddTurn, turnMin, timecheckInMin;
    for(let nhanVien of this.nhanVienCheckIn){
      if(nhanVien.timecheckIn > 0){
        if(turnMin){
          if(nhanVien.turn < turnMin){ 
            turnMin = nhanVien.turn;
          }
        }else{
          turnMin = nhanVien.turn;
        }
      }
    }
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
    return nhanVienAddTurn.id;
  }
  deleteTurn(id){
    for(let nhanVien of this.nhanViens){
      if(nhanVien.id == id){
        nhanVien.turn = nhanVien.turn == 0 ? 0 : nhanVien.turn - 1;
      }
    }
  }
  themNhanVien(){
    this.idNhanVien += 1;
    this.nhanViens.push({id:this.idNhanVien,name:'Nhan Vien' + this.idNhanVien, checkIn: false, turn: 0, timecheckIn:0, prioritize: 0});
  }
}
