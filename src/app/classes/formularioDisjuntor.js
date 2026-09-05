class FormularioDisjuntor {
    constructor() {
        this._subestacao = "";
        this._tag = "";

        this._tipoDisjuntor = "";
        this._dataFabricacao = "";
        this._numeroDePoloPorFase = "";

        this._tensaoNominal = {
            unidade: "kV",
            valor: ""
        };

        this._correnteNominal = {
            unidade: "A",
            valor: ""
        };

        this._capacidadeDeInterrupcao = {
            unidade: "kA",
            valor: ""
        };

        this._fabricante = "";
        this._numeroDeSerie = "";
        this._nivelDeOleo = "";

        this._medicao = {
            resistenciaDeContatoDisjuntorFechado: {
                poloA: {
                    escala: "µΩ",
                    valor: ""
                },
                poloB: {
                    escala: "µΩ",
                    valor: ""
                },
                poloC: {
                    escala: "µΩ",
                    valor: ""
                }
            },
            resistenciaDeContatoDisjuntorAberto: {
                poloA: {
                    escala: ["µΩ", "mΩ", "Ω", "kΩ", "MΩ", "GΩ", "TΩ"],
                    valor: ""
                },
                poloB: {
                    escala: ["µΩ", "mΩ", "Ω", "kΩ", "MΩ", "GΩ", "TΩ"],
                    valor: ""
                },
                poloC: {
                    escala: ["µΩ", "mΩ", "Ω", "kΩ", "MΩ", "GΩ", "TΩ"],
                    valor: ""
                }
            },
            resistenciaDeIsolamento: {
                fase_A_Massa: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                },
                fase_B_Massa: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                },
                fase_C_Massa: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                },
                fase_A_Fase_B: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                },
                fase_A_Fase_C: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                },
                fase_B_Fase_C: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                }
            }
        };
    }

    // =========================
    // SUBESTAÇÃO
    // =========================

    get subestacao() {
        return this._subestacao;
    }

    set subestacao(valor) {
        this._subestacao = valor;
    }


    // =========================
    // TAG
    // =========================

    get tag() {
        return this._tag;
    }

    set tag(valor) {
        this._tag = valor;
    }


    // =========================
    // TIPO DO DISJUNTOR
    // =========================

    get tipoDisjuntor() {
        return this._tipoDisjuntor;
    }

    set tipoDisjuntor(valor) {
        this._tipoDisjuntor = valor;
    }


    // =========================
    // DATA DE FABRICAÇÃO
    // =========================

    get dataFabricacao() {
        return this._dataFabricacao;
    }

    set dataFabricacao(valor) {
        this._dataFabricacao = valor;
    }


    // =========================
    // NÚMERO DE POLOS
    // =========================

    get numeroDePoloPorFase() {
        return this._numeroDePoloPorFase;
    }

    set numeroDePoloPorFase(valor) {
        this._numeroDePoloPorFase = valor;
    }


    // =========================
    // TENSÃO NOMINAL
    // =========================

    get tensaoNominal() {
        return this._tensaoNominal;
    }

    set tensaoNominal(valor) {
        this._tensaoNominal = valor;
    }


    // =========================
    // CORRENTE NOMINAL
    // =========================

    get correnteNominal() {
        return this._correnteNominal;
    }

    set correnteNominal(valor) {
        this._correnteNominal = valor;
    }


    // =========================
    // CAPACIDADE DE INTERRUPÇÃO
    // =========================

    get capacidadeDeInterrupcao() {
        return this._capacidadeDeInterrupcao;
    }

    set capacidadeDeInterrupcao(valor) {
        this._capacidadeDeInterrupcao = valor;
    }


    // =========================
    // FABRICANTE
    // =========================

    get fabricante() {
        return this._fabricante;
    }

    set fabricante(valor) {
        this._fabricante = valor;
    }


    // =========================
    // NÚMERO DE SÉRIE
    // =========================

    get numeroDeSerie() {
        return this._numeroDeSerie;
    }

    set numeroDeSerie(valor) {
        this._numeroDeSerie = valor;
    }


    // =========================
    // NÍVEL DE ÓLEO
    // =========================

    get nivelDeOleo() {
        return this._nivelDeOleo;
    }

    set nivelDeOleo(valor) {
        this._nivelDeOleo = valor;
    }


    // =========================
    // MEDIÇÕES
    // =========================

    get medicao() {
        return this._medicao;
    }

    set medicao(valor) {
        this._medicao = valor;
    }
}