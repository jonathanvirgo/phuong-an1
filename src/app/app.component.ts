import { Component } from '@angular/core';
import { StaffService } from './services/staff.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private staffService: StaffService){
  }
  staffs = [
    {id:1,name:'Nguyen A', checkIn: false, turn: 0, timecheckIn:0,prioritize:0},
    {id:2,name:'Nguyen B', checkIn: false, turn: 0, timecheckIn:0,prioritize:0},
    {id:3,name:'Nguyen C', checkIn: false, turn: 0, timecheckIn:0,prioritize:0}
  ];
  customers = [];
  staffCheckIn = [];
  idCustomer = 0;
  idStaff = 3;
  isAddCus: boolean;
  title = 'phuong-an-vong-tron';
  staffChose: any;
  isStaffChose: boolean;

  checkInNhanVien(id){
    for(let nhanVien of this.staffs){
      if(nhanVien.id == id){
        if(nhanVien.checkIn == false){
          nhanVien.checkIn = true;
          nhanVien.timecheckIn = this.staffService.genTimeStamp();
          this.staffCheckIn.push(nhanVien);
        }else{
          nhanVien.checkIn = false;
          nhanVien.timecheckIn = 0;
          nhanVien.prioritize = 0;
          this.staffCheckIn = this.staffCheckIn.filter(nv => nv.id !== id);
        }
      }
    }
    if(this.staffCheckIn.length > 0){
      this.isStaffChose = true;
      this.staffChose = this.staffCheckIn[0];
    }else{
      this.isStaffChose = false;
    }
  }

  changeTurn(id, type){
    if(this.staffCheckIn.length > 0){
      this.isAddCus = false;
      this.isStaffChose = true;
      this.idCustomer += 1;
      for(let nhanVien of this.staffs){
        if(nhanVien.id == id && nhanVien.checkIn){
          if(type == 'add') {
            this.customers.push({id:this.idCustomer, name: 'Khach Hang ' + this.idCustomer, staff: nhanVien.name});
            nhanVien.turn = nhanVien.turn == 0 ? 1 : nhanVien.turn + 1;
            let turnMinMax = this.staffService.caculateTurnMinMax(this.staffCheckIn);
            this.addPrioritize(turnMinMax[0], turnMinMax[1], this.staffCheckIn);
          }else if(type == 'delete') nhanVien.turn = nhanVien.turn == 0 ? 0 : nhanVien.turn - 1;
        }
      }
    }else{
      this.isAddCus = true;
    }
  }

  themNhanVien(){
    this.idStaff += 1;
    this.staffs.push({id:this.idStaff,name:'Nhan Vien' + this.idStaff, checkIn: false, turn: 0, timecheckIn:0, prioritize: 0});
  }

  private addPrioritize(turnMin, turnMax, staffCheckIn){
    let nvs = this.staffService.caculatePrioritize(turnMin, turnMax, staffCheckIn);
    if(nvs.length > 0){
      for(let nv of nvs){
        for(let nhanvien of this.staffs){
          if(nhanvien.id == nv.id) nhanvien = Object.assign(nhanvien, nv);
          if(nhanvien.id == nvs[0].id) this.staffChose = nhanvien;
        }
      }
    }
  }
}
