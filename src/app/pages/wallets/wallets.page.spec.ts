import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletsPage } from './wallets.page';

describe('WalletsPage', () => {
  let component: WalletsPage;
  let fixture: ComponentFixture<WalletsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(WalletsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
