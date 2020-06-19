let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el)
const cs = (el) => document.querySelectorAll(el)

//Trabalhando com a listagem das pizzas
pizzaJson.map((item,index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', index)
    //preencher as inforações na classe pizzaItem e add na tela
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
             if(sizeIndex == 2){
                size.classList.add('selected');
            } 
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });



        //a quantidade de pizzas sempre irá começar com 1
        c('.pizzaInfo--qt').innerHTML = modalQt;


        //adicionando o efeito de aparecer o modal na página
        c('.pizzaWindowArea').style.opacity = 0; 
        c('.pizzaWindowArea').style.display = 'flex'; //abre o modal na tela
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1; 
        },200)

    })


    c('.pizza-area').append(pizzaItem)
})

//Trabalhando com eventos do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0; 
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none'; //abre o modal na tela
    }, 500) //meio segundo p/ o modal sumir
}
//O código abaixo irá executar a função acima para fechar o modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal)
})

//Trabalhando com os botões mais e menos, a variável modalQt está declarada na linha: 7
c('.pizzaInfo--qtmenos').addEventListener('click',() => {
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt; 
    }

})
c('.pizzaInfo--qtmais').addEventListener('click',() => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt; 
})
//Adicioniar o evento de click para selecionar apenas uma deliciosa pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        //desmarcando item
        c('.pizzaInfo--size.selected').classList.remove('selected'); 

        //marcando item 
        size.classList.add('selected')
    });
});

//adicionando ao carrinho
c('.pizzaInfo--addButton').addEventListener('click',() => {
    //ql a pizza?  
    console.log('A pizza é: ' +modalKey)

    //ql o tamanho selecionado?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))
    console.log('Tamanho: ' +size)

    //qtas pizzas?
    console.log('Quantidade: ' +modalQt)

    //juntando a mesma pizza com tamanhos diferentes 
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => item.identifier == identifier)

    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        //Adicionar no modal
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }


    //fechando o modal e carrinho
    updateCart();
    closeModal();
})

function updateCart(){
    if(cart.length > 0){
        c('aside').classList.add('show');

        c('.cart').innerHTML = '';

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i] > 1 ){
                    cart[i].qt--;
                }
                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart()
            })

            c('.cart').append(cartItem)
               
        }
    } else {
        c('aside').classList.remove('show');
    }
}