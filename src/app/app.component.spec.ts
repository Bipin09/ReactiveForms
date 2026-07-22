import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormArray, FormControl, FormGroup } from '@angular/forms';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the default gender options and forbidden usernames', () => {
    expect(component.genders).toEqual(['male', 'female']);
    expect(component.forbiddenUsernames).toEqual(['Chris', 'Anna']);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture.detectChanges(); // triggers ngOnInit
    });

    it('should build the signup form structure', () => {
      expect(component.signupForm instanceof FormGroup).toBe(true);
      expect(component.signupForm.get('userData') instanceof FormGroup).toBe(true);
      expect(component.signupForm.get('userData.username')).toBeTruthy();
      expect(component.signupForm.get('userData.email')).toBeTruthy();
      expect(component.signupForm.get('gender')).toBeTruthy();
      expect(component.signupForm.get('hobbies') instanceof FormArray).toBe(true);
    });

    it('should default gender to "male" and start with no hobbies', () => {
      expect(component.signupForm.get('gender').value).toEqual('male');
      expect((<FormArray>component.signupForm.get('hobbies')).length).toBe(0);
    });

    it('should patch the username to the forbidden value "Anna"', () => {
      // setValue sets "Max", patchValue then overrides username with "Anna"
      expect(component.signupForm.get('userData.username').value).toEqual('Anna');
      expect(component.signupForm.get('userData.email').value).toEqual('max@test.com');
    });

    it('should mark a forbidden patched username as invalid', () => {
      expect(component.signupForm.get('userData.username').errors)
        .toEqual({ nameIsForbidden: true });
    });
  });

  describe('forbiddenNames validator', () => {
    it('should flag a username that is in the forbidden list', () => {
      const result = component.forbiddenNames(new FormControl('Chris'));
      expect(result).toEqual({ nameIsForbidden: true });
    });

    it('should return null for an allowed username', () => {
      const result = component.forbiddenNames(new FormControl('Max'));
      expect(result).toBeNull();
    });
  });

  describe('forbiddenEmails async validator', () => {
    it('should resolve with an error for the forbidden email', fakeAsync(() => {
      let resolved: any;
      const validation = component.forbiddenEmails(new FormControl('test@test.com'));
      (validation as Promise<any>).then((value) => (resolved = value));
      tick(1500);
      expect(resolved).toEqual({ emailIsForbidden: true });
    }));

    it('should resolve with null for an allowed email', fakeAsync(() => {
      let resolved: any = 'untouched';
      const validation = component.forbiddenEmails(new FormControl('ok@test.com'));
      (validation as Promise<any>).then((value) => (resolved = value));
      tick(1500);
      expect(resolved).toBeNull();
    }));
  });

  describe('onAddHobby', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should push a new required control into the hobbies FormArray', () => {
      const hobbies = <FormArray>component.signupForm.get('hobbies');
      expect(hobbies.length).toBe(0);

      component.onAddHobby();

      expect(hobbies.length).toBe(1);
      const added = hobbies.at(0);
      added.setValue(null);
      expect(added.valid).toBe(false); // required validator attached
    });

    it('should append multiple hobbies in order', () => {
      component.onAddHobby();
      component.onAddHobby();
      expect((<FormArray>component.signupForm.get('hobbies')).length).toBe(2);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset the form values', () => {
      component.signupForm.get('gender').setValue('female');
      component.onSubmit();
      expect(component.signupForm.get('gender').value).toBeNull();
      expect(component.signupForm.get('userData.username').value).toBeNull();
    });
  });
});
