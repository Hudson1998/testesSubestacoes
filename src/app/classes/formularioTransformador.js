class FormularioTransformador {
    constructor() {
        this.tensaoPrimaria = {
            formato: "kV",
            valor: ""
        };
        this.tensaoSecundaria = {
            formato: "V",
            valor: ""
        };
        this.potencia = {
            formato: "kVA",
            valor: ""
        };
        this.peso = {
            formato: "kg",
            valor: ""
        };
        this.volumeDeOleo = {
            formato: "L",
            valor: ""
        };
        this.fabricante = "";
        this.numeroDeSerie = "";
        this.tipoDeTensao = ["Baixa-Baixa", "Alta-Baixa", "Baixa-Alta", "Alta-Alta", "Media-Baixa", "Alta-Media"];
        this.tipoDeFechamento = ["triangulo-estrela", "estrela-triangulo", "estrela-estrela", "triangulo-triangulo", "zigue-zague-estrela", "zigue-zague-triangulo", "triangulo-zigue-zague", "estrela-zigue-zague"];
        this.relacaoDeTransformacao = "";

        this.medicao = {
            relacaoDeTransformacao: "",
            temperaturaAmbiente: "",
            umidadeAmbiente: "",

            resistenciaDeContato: {
                medicao_H1_H2: {
                    escala: "Ω",
                    valor: ""
                },

                medicao_H2_H3: {
                    escala: "Ω",
                    valor: ""
                },

                medicao_H1_H3: {
                    escala: "Ω",
                    valor: ""
                },

                medicao_X0_X1: {
                    escala: "mΩ",
                    valor: ""
                },

                medicao_X0_X2: {
                    escala: "mΩ",
                    valor: ""
                },

                medicao_X0_X3: {
                    escala: "mΩ",
                    valor: ""
                }
            },

            ttr: {
                medicao1: "",
                medicao2: "",
                medicao3: ""
            },

            resistenciaDeIsolamento: {
                AltaMassaGuardaBaixa: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                },

                AltaBaixaGuardaMassa: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                },

                BaixaAltaGuardaMassa: {
                    escala: ["GΩ", "MΩ", "TΩ"],
                    valor: ""
                }
            }
        };
    }
    get tensaoPrimaria() {
        return this._tensaoPrimaria;
    }

    set tensaoPrimaria(valor) {
        this._tensaoPrimaria = valor;
    }

    get tensaoSecundaria() {
        return this._tensaoSecundaria;
    }

    set tensaoSecundaria(valor) {
        this._tensaoSecundaria = valor;
    }   
     get potencia() {
        return this._potencia;
    }

    set potencia(valor) {
        this._potencia = valor;
    }   
     get peso() {
        return this._peso;
    }

    set peso(valor) {
        this._peso = valor;
    }   
     get volumeDeOleo() {
        return this._volumeDeOleo;
    }

    set volumeDeOleo(valor) {
        this._volumeDeOleo = valor;
    }   
     get fabricante() {
        return this._fabricante;
    }

    set fabricante(valor) {
        this._fabricante = valor;
    }   
     get numeroDeSerie() {
        return this._numeroDeSerie;
    }

    set numeroDeSerie(valor) {
        this._numeroDeSerie = valor;
    }   
     get tipoDeTensao() {
        return this._tipoDeTensao;
    }

    set tipoDeTensao(valor) {
        this._tipoDeTensao = valor;
    }   
     get tipoDeFechamento() {
        return this._tipoDeFechamento;
    }

    set tipoDeFechamento(valor) {
        this._tipoDeFechamento = valor;
    }   
     get relacaoDeTransformacao() {
        return this._relacaoDeTransformacao;
    }

    set relacaoDeTransformacao(valor) {
        this._relacaoDeTransformacao = valor;
    }   
     get medicao() {
        return this._medicao;
    }

    set medicao(valor) {
        this._medicao = valor;
    }
}