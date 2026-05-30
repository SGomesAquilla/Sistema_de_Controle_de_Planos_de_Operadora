import { IClienteRepository } from '../../ports/IClienteRepository';
import { ClienteResponseDTO } from '../../dtos/ClienteResponseDTO';

export class ListaClientesUseCase {
    constructor(private readonly clienteRepository: IClienteRepository) {}

    async execute(): Promise<ClienteResponseDTO[]> {
        const clientes = await this.clienteRepository.findAll();

        return clientes.map((cliente) => ({
            codigo: cliente.codigo,
            nome: cliente.nome,
            email: cliente.email,
        }));
    }
}