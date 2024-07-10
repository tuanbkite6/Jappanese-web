import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
interface ItemData {
  id: string;
  name: string;
  age: string;
  address: string;
}
@Component({
  selector: 'app-word-system',
  templateUrl: './word-system.component.html',
  styleUrls: ['./word-system.component.css']
})
export class WordSystemComponent {
  terms: any[] = [];
  initialTerms: any[] = [];
  constructor(private http : WordbookManagementService,
     private toast : NgToastService,
     private fb : FormBuilder
  ){

  }
  i = 0;
  editId: string | null = null;
  listOfData:any;

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(): void {
    const wordGroup = this.fb.group({
      wordKanji: ['', Validators.required],
      wordHiragana: ['', Validators.required],
      wordMean: ['', Validators.required],
      Example: ['', Validators.required],
    });
    this.terms.push(wordGroup);
    console.log(this.terms.length)
  }
  loadTerms() {
    this.terms = this.listOfData
    this.initialTerms = JSON.parse(JSON.stringify(this.terms)); 
    console.log(this.initialTerms);  
  }
  async saveRow(term: any, index: number): Promise<void> {
    const initialTerm = this.initialTerms[index];
console.log(index);
  if(index >= this.initialTerms.length) {
 this.createWord(term)
  }
    else if (
      term.wordKanji !== initialTerm.wordKanji ||
      term.wordHiragana !== initialTerm.wordHiragana ||
      term.wordMean !== initialTerm.wordMean ||
      term.Example !== initialTerm.Example 
    ) {
      const formData = new FormData();
      if (term.wordHiragana !== initialTerm.wordHiragana) {
        formData.append('WordHiragana', term.wordHiragana);
      } else {
        formData.append('WordHiragana', initialTerm.wordHiragana);
      }
      if (term.wordKanji !== initialTerm.wordKanji) {
        formData.append('WordKanji', term.wordKanji);
      } else {
        formData.append('WordKanji', initialTerm.wordKanji);
      }
      if (term.wordMean !== initialTerm.wordMean) {
        formData.append('WordMean', term.wordMean);
      } else {
        formData.append('WordMean', initialTerm.wordMean);
      }
      if (term.Example !== initialTerm.Example) {
        formData.append('WordExample', term.Example);
      } else {
        formData.append('WordExample', initialTerm.Example);
      }
  

      try {
        const response = await this.http.updateWord(term.wordId, formData).toPromise();
        this.toast.success({
          detail: 'Success',
          summary: 'Từ vựng đã được cập nhật',
          duration: 5000,
        });
        // Update initial term after successful update
        this.initialTerms[index] = { ...term };
      } catch (error) {
        console.error('Error updating term:', error);
        this.toast.warning({
          detail: 'Warning',
          summary: 'Cập nhật từ vựng thất bại',
          duration: 5000,
        });
      }
    }
    this.stopEdit();
  }
  async createWord(term: any): Promise<void> {
    const payload = {
      wordMean: term.wordMean,
      wordHiragana: term.wordHiragana,
      wordKanji: term.wordKanji,
      example: term.Example
    };
  console.log(payload);
    try {
      const response = await this.http.createWordSystem(payload).toPromise();
      this.toast.success({
        detail: 'Success',
        summary: 'Từ vựng đã được lưu',
        duration: 5000,
      });
  
      term.wordId = response.wordId; // Assuming response contains the new wordId
      this.initialTerms.push({ ...term });
  
      this.loadTerms();
    } catch (error : any) {
      console.error('Error creating term:', error);
      const errorMessage = error.error?.message || 'Hãy nhập đủ để lưu';
      this.toast.warning({
        detail: 'Warning',
        summary: errorMessage,
        duration: 5000,
      });
    }
  
    this.stopEdit();
  }
  async deleteRow(id: string) {
    const response = await this.http
            .deleteWordById(id)
            .subscribe(
              (response) => {
                this.fetchData()
                this.toast.success({
                  detail: 'Success',
                  summary: 'Từ vựng đã được xoá',
                  duration: 5000,
                });
              },
              (error) => {
                this.toast.warning({
                  detail: 'Warning',
                  summary: 'Chưa xóa được từ vựng',
                  duration: 5000,
                });
              }
            );
        }
  
  fetchData():any{
    this.http.getWordsByType(1).subscribe(res => {
      this.listOfData = res
      this.loadTerms()
    })
    }
  ngOnInit() {
    this.fetchData()
    
  }
}
