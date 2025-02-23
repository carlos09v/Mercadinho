const res = document.querySelector('.res')
const form = document.querySelector('#cadastro')
const btnCalc = document.querySelector('#btn-calc')
const btnEnviar = document.querySelector('[submit]')
const prodSpan = document.querySelector('#prod')
const data = document.querySelector('.data')
let tot = 0
let prod = 1
const lista = []
let totParcela

const resetLabel = () => {
    form[0].value = ''
    form[1].value = ''
}

const validateInputs = (nomeInput, valorInput) => {
    if(nomeInput === '') return alert('Nome precisa estar preenchido :)')
    if(isNaN(valorInput)) {
        return alert('O valor precisa ser um número !')
    }else if(form[1].value === '') return alert('Alerta: Valor está vazio !!')
    lista.push(nomeInput)
    if(lista.length >= 8) return alert('Você excedeu o limite de cadastro. Finalize a compra !!')

    return true
}

// Hide/Show Button
const showData = document.querySelector('.btnShow')
showData.onclick = e => {
    e.preventDefault()
    
    // `ñ consegui fazer com ternário
    // Toggle display
    if(res.style.display == 'none') {
        res.style.display = 'block'
    }else {
        res.style.display = 'none'
    }
}

// Submit Button
btnEnviar.onclick = e => {
    e.preventDefault()
    let nome = (form[0].value).trim()
    let valor = Number(form[1].value)
    // Validações
    if(!validateInputs(nome, valor)) return

    const label = document.createElement('p')

    prodSpan.innerText = ++prod
    tot += valor
    label.innerText = `${nome} ${valor}`

    data.appendChild(label)
    resetLabel() // Format Inputs
    showData.style.display = 'block'
}

// Finalizar Button
const calc = () => {
    res.innerHTML = ''
    form.style.display = 'none'
    prodSpan.parentNode.style.display = 'none'

    const resul = document.createElement('div')
    resul.classList.add('resul')

    const btnBuy = document.createElement('button')
    btnBuy.innerText = 'Ver OPÇÕES DE PAGAMENTO !'
    btnBuy.classList.add('btnShow')
    
    resul.innerHTML = `<h2>O resultado total dos seus produtos foi <span>R$ ${Number(tot).toFixed(2)}</span> !</h2>`
    resul.appendChild(btnBuy)
    res.appendChild(resul)

    // optBuy Button
    btnBuy.onclick = e => {
        e.preventDefault()
        resul.removeChild(btnBuy)
        resul.innerHTML += '<hr>'
        const dataBuy = document.createElement('div')
        dataBuy.classList.add('dataBuy')
        dataBuy.innerHTML = `
        <table>
            <tr>
                <th colspan="2">OPÇÕES DE PAGAMENTO:</th>
            </tr>
            <tr>
                <td>[ 1 ] Á vista dinheiro/cheque (10% de desconto)</td>
                <td>[ 2 ] Á vista Cartão débito (5% de desconto)</td>
            </tr>
            <tr>
                <td>[ 3 ] 2x no Cartão</td>
                <td>[ 4 ] 3x ou mais no Cartão (20% de Juros)</td>
            </tr>
        </table>

        <input class='optValue' id='inputValue' type='number' min='1' max='4' placeholder="Opção...">
        `

        const optSubmitBtn = document.createElement('button')
        optSubmitBtn.innerText = 'Enviar'
        optSubmitBtn.classList.add('btnShow')

        dataBuy.appendChild(optSubmitBtn)
        resul.appendChild(dataBuy)

        // optSubmit Button
        optSubmitBtn.onclick = e => {
            e.preventDefault()
            let totValue
            const inputValue = Number(document.querySelector('#inputValue')?.value)
            if (inputValue === '') return alert('Campo em branco !')

            switch (inputValue) {
                case 1:
                    totValue = tot-(tot*10/100)
                    resul.innerHTML = `<h2>Sua compra será paga a vista no dinheiro/cheque por <span id='tot'>R$ ${tot.toFixed(2)}</span> COM <span>10% DE DESCONTO</span> !</h2>`
                    resul.innerHTML += '<hr>'
                    setTimeout(() => {
                        resul.innerHTML += '<br><h2>Realizando pagamento...</h2>'
        
                        setTimeout(() => {
                            resul.innerHTML += '<br><h2>Pagamento efetuado com sucesso!</h2>'
                            resul.innerHTML += `<br><h2>Sua compra deu no total <span>R$ ${totValue.toFixed(2)}</span> !</h2>`
                            resul.innerHTML += '<br><h2><<< Volte Sempre! >>></h2>'
                        }, 3000)
                    }, 500)
                    break
                case 2:
                    totValue = tot-(tot*5/100)
                    resul.innerHTML = `<h2>Sua compra será paga a vista no cartão por <span id='tot'>R$ ${tot.toFixed(2)}</span> COM <span>5% DE DESCONTO</span> !</h2>`
                    resul.innerHTML += '<hr>'
                    setTimeout(() => {
                        resul.innerHTML += '<br><h2>Realizando pagamento...</h2>'
        
                        setTimeout(() => {
                            resul.innerHTML += '<br><h2>Pagamento efetuado com sucesso!</h2>'
                            resul.innerHTML += `<br><h2>Sua compra deu no total <span>R$ ${totValue.toFixed(2)}</span> !</h2>`
                            resul.innerHTML += '<br><h2><<< Volte Sempre! >>></h2>'
                        }, 3000)
                    }, 500)
                    break
                case 3:
                    const parcela = tot/2
                    totValue = parcela
                    resul.innerHTML = `<h2>Sua compra será parcelada pra <span id='parcel'>2x</span> de <span id='tot'>R$ ${tot.toFixed(2)}</span> SEM JUROS !</h2>`
                    resul.innerHTML += '<hr>'
                    setTimeout(() => { 
                        resul.innerHTML += '<br><h2>Realizando pagamento...</h2>'
        
                        setTimeout(() => {
                            resul.innerHTML += '<br><h2>Pagamento efetuado com sucesso!</h2>'
                            resul.innerHTML += `<br><h2>Sua compra deu no total <span>R$ ${totValue.toFixed(2)}</span> pra <span id='parcel'>2x</span> !</h2>`
                            resul.innerHTML += '<br><h2><<< Volte Sempre! >>></h2>'
                        }, 3000)
                    }, 500)
                    break
                case 4:
                    totValue = tot+(tot*20/100)
                    resul.innerHTML = `<h2>O resultado total dos seus produtos foi <span>R$ ${Number(tot).toFixed(2)}</span> !</h2>`
                    resul.innerHTML += '<hr>'
                    resul.innerHTML += `
                    <h2>Quantas parcelas ?</h2>
                    <input type='number' min='1' max='12' class='optValue' id='inputValue2' placeholder='Ate 12x...'>`
                    const opt4Btn = document.createElement('button')
                    opt4Btn.innerText = 'Enviar'
                    opt4Btn.classList.add('btnShow')
                    resul.appendChild(opt4Btn)
                    opt4Btn.onclick = e => {
                        e.preventDefault()
                        const inputValue2 = Number(document.querySelector('#inputValue2')?.value)
                        totParcela = totValue/inputValue2

                        if(inputValue2 > 12 || inputValue2 <= 0) return alert('Quantidade de parcelas inválida! Máximo é 12.')

                        resul.innerHTML = `<h2>Sua compra será parcelada em <span id='parcel'>${inputValue2}x</span> de <span id='tot'>R$${tot}</span> COM <span id='juros'>20% DE JUROS</span> !</h2>`
                        resul.innerHTML += '<hr>'

                        setTimeout(() => {
                            resul.innerHTML += '<br><h2>Realizando pagamento...</h2>'
            
                            setTimeout(() => {
                                resul.innerHTML += '<br><h2>Pagamento efetuado com sucesso!</h2>'
                                resul.innerHTML += `<br><h2>Sua compra deu no total <span>R$ ${totParcela.toFixed(2)}</span> de <span id='parcel'>${inputValue2}x</span> !</h2>`
                                resul.innerHTML += '<br><h2><<< Volte Sempre! >>></h2>'
                            }, 3000)
                        }, 500)
                    }
                    break
                default:
                    return alert('Opção Inválida. Tente novamente!')
            }
        }
    }
}