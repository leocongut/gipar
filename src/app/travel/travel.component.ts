import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../core/auth/auth.service';
import { User, Proposal, Travel } from '../shared/datamodel';
import { UtilsService } from '../core/utils/utils.service';


@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css']
})
export class TravelComponent implements OnInit {

  loader = { "user": true, "travel": true };
  travels: any[];
  filteredTravels: any[];
  
  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    private route: ActivatedRoute,
    private utils: UtilsService ) {
    this.getTravels();
  }

  ngOnInit() {

  }

  gotoDetail(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  createNew(){
    this.router.navigate(['-'], { relativeTo: this.route });
  }

  onFilter(value: string) {
    this.filteredTravels = this.travels.filter(travel =>
      travel.userObj.adsuser.toLowerCase().indexOf(value['target'].value.toLowerCase()) > -1 ||
      travel.userObj.name.toLowerCase().indexOf(value['target'].value.toLowerCase()) > -1 ||
      travel.userObj.lastname.toLowerCase().indexOf(value['target'].value.toLowerCase()) > -1 ||
      travel.finish.toLowerCase().indexOf(value['target'].value.toLowerCase()) > -1 ||
      travel.proposalObj.id.toLowerCase().indexOf(value['target'].value.toLowerCase()) > -1 ||
      travel.start.toLowerCase().indexOf(value['target'].value.toLowerCase()) > -1)
  }

  private getTravels() {
    this.db.list('/travels').subscribe(a => {
      this.travels = a;
      this.travels.forEach(travel => {
        travel.userObj = new User();
        travel.proposalObj = new Proposal();
        this.db.object('/users/' + travel.user).subscribe(a => { travel.userObj = a; this.loader.user = false; });
        this.db.object('/proposals/' + travel.proposal).subscribe(a => { travel.proposalObj = a; this.loader.travel = false; });
      }
      );
      this.filteredTravels = this.travels;

    });
  }

}
