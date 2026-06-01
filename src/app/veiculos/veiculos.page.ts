import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList,IonThumbnail,
  IonItem, IonLabel, IonButton, IonButtons, IonSpinner, IonIcon,
  IonRefresher, IonRefresherContent, IonBadge, IonModal, IonInput,
  IonSelect, IonSelectOption, ToastController, AlertController, IonItemSliding,
} from '@ionic/angular/standalone';
import { VeiculoService } from '../core/services/veiculo.service';
import { AuthService } from '../core/services/auth.service';
import { Veiculo } from '../core/models/veiculo.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-veiculos',
  templateUrl: 'veiculos.page.html',
  styleUrls: ['veiculos.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonThumbnail,
    IonItem, IonLabel, IonButton, IonButtons, IonSpinner, IonIcon,
    IonRefresher, IonRefresherContent, IonBadge, IonModal, IonInput,
    IonSelect, IonSelectOption,
  ],
})
export class VeiculosPage implements OnInit {
  veiculos: Veiculo[] = [];
  carregando = true;
  nomeUsuario = '';
  modalAberto = false;
  veiculoEditando: Partial<Veiculo> = {};
  veiculoEditandoId: number | null = null;

  constructor(
    private veiculoService: VeiculoService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.nomeUsuario = this.authService.getUsuario()?.nome || 'Usuário';
    this.carregarVeiculos();
    /*
    await this.storage.create(); aula
    const registro = await this.storage.get('usuario');

    if(registro){
    this.usuario = Object.assign(new Usuario(), registro);
    this.consultarVeiculosSistemaWeb();
    }
    else{
      this.controle_navegacao.navigateRoot('/home');
    }

    */
  }

  /*

  async consultarVeiculosSistemaWeb(){
  const loading = await this.controle_caregamento.create({message: 'Carregando veículos...'});
  await loading.present();

  const options: HttpOptions = {
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${this.usuario.token}`
    },
    url: 'http://localhost:8000/veiculo/api/listar/'
  };

  CapacitorHttp.get(options)
  .then((resposta: HttpResponse) => {
    if(resposta.status == 200){
      this.lista_veiculos = resposta.data;
      console.log(this.lista_veiculos);
      loading.dismiss();
    }
    else{
      loading.dismiss();
      this.apresenta_mensage('Erro ao carregar veículos, código: ${resposta.status}');
    }
  })
    .catch(async (erro:any) => {
      console.log(erro);
      loading.dismiss();
      this.apresenta_mensage('Erro ao carregar veículos, código: ${erro?.status}');
    }
  
  */

  carregarVeiculos() {
    this.carregando = true;
    this.veiculoService.listar().subscribe({
      next: (lista) => {
        this.veiculos = lista;
        this.carregando = false;
      },
      error: async (erro) => {
        this.carregando = false;
        if (erro.status === 401) {
          this.authService.logout();
          this.router.navigate(['/home']);
        } else {
          await this.mostrarToast('Erro ao carregar veículos.', 'danger');
        }
      },
    });
  }

  getFotoUrl(id: number): string {
    return `${environment.apiUrl}/veiculo/api/foto/${id}/`;
  }

  // ─── EDITAR ───────────────────────────────────────────
  editarVeiculo(veiculo: Veiculo) {
    // copia os dados do veículo para o formulário do modal
    this.veiculoEditandoId = veiculo.id;
    this.veiculoEditando = {
      modelo: veiculo.modelo,
      ano: veiculo.ano,
      marca: veiculo.marca,
      cor: veiculo.cor,
      combustivel: veiculo.combustivel,
    };
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.veiculoEditando = {};
    this.veiculoEditandoId = null;
  }

  salvarEdicao() {
    if (!this.veiculoEditandoId) return;

    this.veiculoService.editar(this.veiculoEditandoId, this.veiculoEditando).subscribe({
      next: async () => {
        await this.mostrarToast('Veículo atualizado com sucesso!', 'success');
        this.fecharModal();
        this.carregarVeiculos(); 
      },
      error: async () => {
        await this.mostrarToast('Erro ao atualizar veículo.', 'danger');
      },
    });
  }

  // ─── EXCLUIR ──────────────────────────────────────────
  async confirmarExclusao(veiculo: Veiculo) {
    const alert = await this.alertController.create({
      header: 'Excluir veículo',
      message: `Deseja excluir o ${veiculo.nome_marca} ${veiculo.modelo}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => this.excluirVeiculo(veiculo.id),
        },
      ],
    });
    await alert.present();
  }

  excluirVeiculo(id: number) {
    this.veiculoService.excluir(id).subscribe({
      next: async () => {
        await this.mostrarToast('Veículo excluído com sucesso!', 'success');
        this.carregarVeiculos(); // recarrega a lista
      },
      error: async () => {
        await this.mostrarToast('Erro ao excluir veículo.', 'danger');
      },
    });
  }

  // ─── UTILITÁRIOS ──────────────────────────────────────
  async mostrarToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  handleRefresh(event: any) {
    this.veiculoService.listar().subscribe({
      next: (lista) => { this.veiculos = lista; event.target.complete(); },
      error: () => event.target.complete(),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}