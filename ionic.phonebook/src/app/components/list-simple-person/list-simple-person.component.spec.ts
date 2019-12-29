import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListSimplePersonComponent } from './list-simple-person.component';

describe('ListSimplePersonComponent', () => {
  let component: ListSimplePersonComponent;
  let fixture: ComponentFixture<ListSimplePersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSimplePersonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListSimplePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
