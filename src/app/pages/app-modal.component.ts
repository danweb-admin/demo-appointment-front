import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../app.service';
import { da } from 'date-fns/locale';

@Component({
    selector: 'app-modal',
    templateUrl: 'app-modal.component.html',
    styleUrls: ['./app-modal.component.scss']
})
export class AppModalComponent implements OnInit {
    form!: FormGroup;
    @Input() event: any;
    locatarios: any[] = [];
    
    constructor(public activeModal: NgbActiveModal, 
                private fb: FormBuilder,
                private appService: AppService) {}
    
    ngOnInit(): void {
        this.loadClients();
        this.createForm();
    }
    
    createForm(): void {
        this.form = this.fb.group({
            locatario: ['', Validators.required],
            semCadastro: [false],
            equipamento: ['', Validators.required],
            dataCriacao: [{ value: new Date(), disabled: true }],
            ponteiras: [''],
            status: ['Pendente'],
            tecnica: [''],
            motoristaEntrega: [''],
            motoristaRecolhe: [''],
            data: ['', Validators.required],
            inicio: ['', Validators.required],
            fim: ['', Validators.required],
        });
    }
    
    onNoClick(): void {
        this.activeModal.close();
    }
    
    onSubmit(): void {
        
    }
    
    maskPhone(value: string): string {
        
        if (value === undefined)
            return ''
        
        return value
        .replace(/\D/g, '') // remove tudo que não é dígito
        .replace(/^(\d{2})(\d)/, '($1) $2') // coloca parênteses no DDD
        .replace(/(\d{5})(\d{4})$/, '$1-$2'); // coloca o traço
    }

    loadClients(){
        this.appService.getClients(true,'').subscribe(data => {
            this.locatarios = data;
            console.log(this.locatarios);
        });
    }
}