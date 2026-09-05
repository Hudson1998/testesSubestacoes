class FormularioTransformador {
    constructor() {
        this.tecnicoNome = "";
        this.data = {
            formato: "dd/MM/yyyy",
            valor: ""
        };
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
}