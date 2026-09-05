class FormularioInspecao {

    constructor() {

        // =========================
        // CLIENTE
        // =========================

        this._cliente = {
            nome: "",
            endereco: "",
            telefone: "",
            email: ""
        };


        // =========================
        // SUBESTAÇÃO
        // =========================

        this._subestacao = {
            nome: "",
            localizacao: "",
            capacidade: "",
            tensao: ""
        };


        // =========================
        // RESPONSÁVEL TÉCNICO
        // =========================

        this._responsavelTecnico = {
            nome: "",
            registro: "",
            telefone: "",
            email: ""
        };


        // =========================
        // DATA DA INSPEÇÃO
        // =========================

        this._dataInspecao = {
            formato: "dd/MM/yyyy",
            valor: ""
        };
    }


    // =========================
    // GETTERS E SETTERS
    // =========================


    // CLIENTE

    get cliente() {
        return this._cliente;
    }

    set cliente(valor) {
        this._cliente = valor;
    }


    // SUBESTAÇÃO

    get subestacao() {
        return this._subestacao;
    }

    set subestacao(valor) {
        this._subestacao = valor;
    }


    // RESPONSÁVEL TÉCNICO

    get responsavelTecnico() {
        return this._responsavelTecnico;
    }

    set responsavelTecnico(valor) {
        this._responsavelTecnico = valor;
    }


    // DATA DA INSPEÇÃO

    get dataInspecao() {
        return this._dataInspecao;
    }

    set dataInspecao(valor) {
        this._dataInspecao = valor;
    }
}