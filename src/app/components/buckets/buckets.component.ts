import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BucketService } from '../../services/bucket.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Bucket } from '../../interfaces/bucket.interfaces';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ManageBucketComponent } from '../manage-bucket/manage-bucket.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AddBlobComponent } from '../add-blob/add-blob.component';
import { decodeToken } from '../../helpers/token';
import { ManageBlobComponent } from '../manage-blob/manage-blob.component';


@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BucketsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['type', 'name', 'size', 'manage'];
  dataSource: MatTableDataSource<Bucket>;
  public data: [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public optimistic;
  public urlParam;
  public path;

  constructor(private bucketService: BucketService, private route: ActivatedRoute,
              private router: Router, public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef) {
    this.data = [];
  }

  ngOnInit() {
    this.refresh();
    this.urlParam = this.router.routerState.snapshot.url.split('/').pop().toString();
  }

  public ngOnDestroy(): void {
    this.dataSource = new MatTableDataSource<Bucket>([]);
    this.urlParam = '';
    this.data = [];
    this.path = '';
  }

  public openBucket(row) {
    return this.router.navigate(['/bucket', row.id], { state: { row } }).then(() => {
      this.refresh();
    });
  }

  public addBlob(e: Event) {
    e.preventDefault();
    if (this.urlParam === 'bucket') {
      this.dialog.open(AddBlobComponent, {
        autoFocus: true,
        disableClose: true,
        data: {
          title: 'Add',
        }
      }).afterClosed().subscribe(res => {
        if (res !== null) {
          this.optimistic = res;
          this.dataSource.data.push({ name: this.optimistic, id: null });
          this.dataSource.paginator = this.paginator;
          this.refresh();
        }
      });
    } else {
      this.dialog.open(AddBlobComponent, {
        autoFocus: true,
        disableClose: true,
        data: {
          title: 'Add',
          path: this.path
        }
      }).afterClosed().subscribe(res => {
        if (res !== null) {
          this.optimistic = res;
          this.dataSource.data.push({ name: this.optimistic, id: null });
          this.dataSource.paginator = this.paginator;
          this.refresh();
        }
      });
    }
  }

  public returnOptimist(res) {
    if (res !== null) {
      this.optimistic = res;
      this.dataSource.data.push({ name: this.optimistic, id: null });
      this.dataSource.paginator = this.paginator;
      this.refresh();
    }
  }

  public duplicateBlob(e: Event, row) {
    e.preventDefault();
    this.dialog.open(ManageBlobComponent, {
      autoFocus: true,
      disableClose: true,
      data: {
        title: 'Duplicate',
        infos: row
      }
    }).afterClosed().subscribe(res => {
      this.returnOptimist(res);
    });
  }

  public deleteBlob(e: Event, row) {
    e.preventDefault();
    this.dialog.open(ManageBlobComponent, {
      autoFocus: true,
      disableClose: true,
      data: {
        title: 'Delete',
        infos: row
      }
    }).afterClosed().subscribe(res => {
      this.returnOptimist(res);
    });
  }

  public dowloadBlob(e: Event, row) {
    e.preventDefault();
    this.dialog.open(ManageBlobComponent, {
      autoFocus: true,
      disableClose: true,
      data: {
        title: 'Download',
        infos: row
      }
    }).afterClosed().subscribe(res => {
      this.returnOptimist(res);
    });
  }

  public informationBlob(e: Event, row) {
    e.preventDefault();
    this.dialog.open(ManageBlobComponent, {
      autoFocus: true,
      disableClose: false,
      data: {
        title: 'Information',
        infos: row
      }
    }).afterClosed().subscribe(res => {
      this.returnOptimist(res);
    });
  }


  public createBucket(e: Event) {
    e.preventDefault();
    this.dialog.open(ManageBucketComponent, {
      autoFocus: true,
      disableClose: true,
      data: {
        title: 'Create',
      }
    }).afterClosed().subscribe(res => {
      if (res !== null) {
        this.optimistic = res;
        this.dataSource.data.push({ name: this.optimistic, id: null });
        this.dataSource.paginator = this.paginator;
        this.refresh();
      }
    });
  }

  public editBucket(e: Event, row) {
    e.preventDefault();
    this.dialog.open(ManageBucketComponent, {
      autoFocus: true,
      disableClose: true,
      data: {
        title: 'Edit',
        infos: row
      }
    }).afterClosed().subscribe(res => {
      if (res !== null) {
        this.optimistic = res;
        this.dataSource.data.push({ name: this.optimistic, id: null });
        this.dataSource.paginator = this.paginator;
        this.refresh();
      }
    });
  }

  public deleteBucket(e: Event, row) {
    e.preventDefault();
    this.dialog.open(ManageBucketComponent, {
      autoFocus: true,
      disableClose: true,
      data: {
        title: 'Delete',
        infos: row
      }
    }).afterClosed().subscribe(res => {
      this.returnOptimist(res);
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public refresh() {
    this.urlParam = this.router.routerState.snapshot.url.split('/').pop().toString();
    if (this.urlParam === 'bucket') {
      this.bucketService
        .getBucketById({
          id: decodeToken().parentIdBucket
        })
        .subscribe(res => {
          let resTemp = [];
          res.map(b => {
            if (b.name === b.user.uuid) {
              this.data = res.filter(i => i.id === b.id);
              resTemp = res.filter(i => i.id !== b.id);
              b.blobs.map(i => resTemp.push(i));
            }
          });
          this.dataSource = new MatTableDataSource<Bucket>(resTemp);
        }, error => {
          return error.message;
        }, () => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    } else {
      this.bucketService.getBucketById({
        id: this.urlParam
      }).subscribe(res => {
        let resTemp = [];
        res.map(b => {
          if (b.id === +this.urlParam) {
            console.log('bucket', b);
            this.path = b.path;
            this.data = res.filter(i => i.id === b.id);
            resTemp = res.filter(i => i.id !== b.id);
            b.blobs.map(i => resTemp.push(i));
          }
        });
        this.data = res;
        this.dataSource = new MatTableDataSource<Bucket>(resTemp);
      }, error => {
        return error.message;
      }, () => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  public isFile(row): boolean {
    return !!row.size;
  }
}
