let subject = "Test"
let body = "hey this is a test"
window.open("mailto:test@example.com?subject=subject&body=body");

let foodFactory = (foodObject) => {

    let htmlBlock = `
    <div class="foodbox">
    <h1>${foodObject.name}</h1>
    <p>Ethnicity: ${foodObject.ethnicity}</p>
    <p>Category: ${foodObject.catergory}</p>
    <p>Ingredients:</p>
    <ul class="ingredients">${foodObject.ingredients}</ul>
    <p> Country of Origin: ${foodObject.countryOfOrigin}</p>
    <p>Calories per Serving: ${foodObject.caloriesPerServing}</p>
    <p>Fat per Serving: ${foodObject.fatPerServing2}</p>
    <p>Sugar per Serving: ${foodObject.sugarPerServing}</p>
    </div>
    `
    return htmlBlock
}

let addFoodToDom = (poop) => {
    document.querySelector(".foodList").innerHTML += poop
}

fetch("http://127.0.0.1:8088/foods?_sort=name&_order=desc")
    .then(response => response.json())
    .then(myParsedFoods => {
        // console.log("FOOD", myParsedFoods)
        myParsedFoods.forEach(food => {
            // console.log(food) // Should have a `barcode` property

            // Now fetch the food from the Food API
            fetch(`https://world.openfoodfacts.org/api/v0/product/${food.barcode}.json`)
                .then(response => response.json())
                .then(productInfo => {
                    console.table(productInfo.product.ingredients)
                    food.ingredients = productInfo.product.ingredients.map(i => {                       
                        let stringI = ""
                        function toTitleCase(str) {
                            return str.replace(/\w\S*/g, function(txt){
                                if (txt.includes("poivron")) {
                                    
                                }
                                const upperCased = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                return upperCased
                            });
                            
                        }
                        if (i.text.length >= 120) {                          
                            // console.log(i.text.split(" "))
                            let newArray = i.text.split(" ")
                            return stringI += `<li>${newArray[18]} ${newArray[19]}</li>`
                        } 
                        else if (i.text === "dont _gluten_" || i.text === "For allergens see ingredients in bold") {}
                        else if (i.text.charAt(0) === "E" && isNaN(i.text.charAt(1)) === false) {}
                        else if (i.text === "épices") {
                            
                            i.text = i.text.charAt(0).toUpperCase() + i.text.slice(1);
                             
                            stringI += `<li>${i.text}</li>`
                            return stringI 
                        }
                        
                        
                        else {
                            
                            i.text = i.text.split("_").join("")
                            
                         
                            i.text = toTitleCase(i.text)
                       
                            stringI += `<li>${i.text}</li>`
                            // console.log(typeof stringI)
                            return stringI 
                        } 
                    })
                    
                    // console.log( food.ingredients)

                     food.ingredients = food.ingredients.filter(function(item, index){
                        return food.ingredients.indexOf(item) >= index;
                    });

                    food.ingredients =  food.ingredients.join("")
                    // for (let i = 0; i < food.ingredients.length; i++) {
                    //     const element = food.ingredients.charAt(i);
                    //     const element2 = food.ingredients.charAt(i+1)
                    //     let j = i
                    //     if (element === "é" && element2 === "P") {
                    //         // console.log("!!!!!!!", j)
                    //         food.ingredients = food.ingredients.replace("P","p")
                    //         food.ingredients = food.ingredients.replace("é","É")
                    //         food.ingredients = food.ingredients.replace("P","p")
                    //     }
                    // }

                    

                    // console.log(food.ingredients)
                    food.countryOfOrigin = productInfo.product.countries
                    food.caloriesPerServing = productInfo.product.nutriments.energy
                    food.fatPerServing = productInfo.product.nutriments.fat_serving
                    food.fatPerServing2 = productInfo.product.nutriments.fat
                    food.sugarPerServing = productInfo.product.nutriments.sugars

                    // Produce HTML representation
                    const foodAsHTML = foodFactory(food)
                    // console.table(food)

                    // Add representaiton to DOM
                    addFoodToDom(foodAsHTML)

                })
        })
    })




