const Validation = require("../utils/Validation");

// describe("Teste para validação de CPF ",()=>{
//     it("Deve retornar TRUE pu FALSE caso o CPF sej válido ou inválido ",()=>{
//         const cpf = "41429669870";
//         expect(Validation.validarCPF(cpf)).toBeTruthy();
//     });
// });


// describe("Teste para validação de CNPJ ",()=>{
//     it("Deve retornar TRUE pu FALSE caso o CNPJ sej válido ou inválido ",()=>{
//         const cnpj = "50.562.962/0001-02";
//         expect(Validation.validarCNPJ(cnpj)).toBeTruthy();
//     });
// });

    // describe("Validando Data",()=>{
    //     it("Deve retornar um numero inteiro",()=>{
    //         const dozeHoras = 12*3600*1000;
    //         const noveHoras = 9*3600*1000;

    //         const diferença = dozeHoras-noveHoras;

    //         console.log(diferença/1000/3600);
    //     })
    // });

    test("Transformando String em base64",()=>{
        var string = "Emanoel";
        var emBase64 = new Buffer(string).toString("base64");
        console.log("Base64", emBase64);


        var deBase64 = new Buffer(emBase64,"base64").toString("ascii");
        console.log("De base64", deBase64);
    })