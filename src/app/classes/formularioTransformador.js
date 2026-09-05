class FormularioTransformador {
    constructor() {
        this.tecnicoNome = "";
        this.data = "";
        this.tensaoPrimaria = "";
        this.tensaoSecundaria = "";
        this.potencia = "";
        this.peso = "";
        this.volumeDeOleo = "";
        this.fabricante = "";
        this.numeroDeSerie = "";
        this.relacaoDeTransformacao = "";

        this.medicao = {
            relacaoDeTransformacao: "",
            temperaturaAmbiente: "",
            umidadeAmbiente: "",

            resistenciaDeContato: {
                medicao_H1_H2: {
                    escala: "ohms",
                    valor: ""
                },

                medicao_H2_H3: {
                    escala: "ohms",
                    valor: ""
                },

                medicao_H1_H3: {
                    escala: "ohms",
                    valor: ""
                },

                medicao_X0_X1: {
                    escala: "mili ohms",
                    valor: ""
                },

                medicao_X0_X2: {
                    escala: "mili ohms",
                    valor: ""
                },

                medicao_X0_X3: {
                    escala: "mili ohms",
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
                    escala: ["Giga ohms", "Mega ohms", "Tera ohms"],
                    valor: ""
                },

                AltaBaixaGuardaMassa: {
                    escala: ["Giga ohms", "Mega ohms", "Tera ohms"],
                    valor: ""
                },

                BaixaAltaGuardaMassa: {
                    escala: ["Giga ohms", "Mega ohms", "Tera ohms"],
                    valor: ""
                }
            }
        };
    }
}