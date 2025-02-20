const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then((res) => res.json())
        .then(data => displayCategories(data.categories))
        .catch((error) => console.log(error))
}
const loadPets = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then((res) => res.json())
        .then(data => {
            currentPets = data.pets
            displayPets(currentPets)
        })
        .catch((error) => console.log(error));
}
const loadCategoryPets = (category) => {
    showSpinner()
    const delay = new Promise(resolve => setTimeout(resolve, 2000))

    fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
        .then((res) => res.json())
        .then(data => {
            Promise.all([delay]).then(() => {
                hideSpinner()
                const allButtons = document.querySelectorAll('.category-btn')
                allButtons.forEach(button => button.classList.remove('active'))

                const activeBtn = Array.from(allButtons).find(btn => btn.textContent.trim() === category)
                if (activeBtn) {
                    activeBtn.classList.add("active")
                }
                
                currentPets = data.data
                displayPets(currentPets)
            });
        });
}
const loadDetails = async (petId) =>{
    const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    const res = await fetch(uri)
    const data = await res.json()
    const pet = data.petData
    displayDetails(pet)
}
const showSpinner = () => {
    document.getElementById("loadingSpinner").classList.remove("hidden");
}
const hideSpinner = () => {
    document.getElementById("loadingSpinner").classList.add("hidden");
}
let currentPets = []
const sortPetsByPrice = () => {
    currentPets.sort((a, b) => b.price - a.price)
    displayPets(currentPets)
};
document.getElementById("sortByPrice").addEventListener("click", sortPetsByPrice)
const adoptPet = (button) => {
    let countdown = 3

    const modal = document.getElementById("adoptModal")
    const countdownText = document.getElementById("countdownText")
    modal.classList.remove("hidden")

    const countdownInterval = setInterval(() => {
        countdownText.innerText = `${countdown}`
        countdown--

        if (countdown < 0) {
            clearInterval(countdownInterval);
            button.textContent = "Adopted"
            button.disabled = true

            setTimeout(() => {
                modal.classList.add("hidden")
            }, 2000)
        }
    }, 1000)
}
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("adoptModal").classList.add("hidden")
})
const displayDetails = (pet) =>{
    const detailContainer = document.getElementById("modal-content")
    document.getElementById("showModalData").click()

    const breed = pet.breed ? pet.breed : "Breed not available"
    const price = pet.price ? pet.price : "Price not available"
    const gender = pet.gender ? pet.gender : "Gender not specified"
    const dob = pet.date_of_birth ? pet.date_of_birth : "Date of birth not available"
    const vaccine = pet.vaccinated_status ? pet.vaccinated_status : "Vaccination status unknown"

    detailContainer.innerHTML=`
    <img class="w-full rounded-lg" src="${pet.image}"/>
    <h1 class="text-lg md:text-xl lg:text-2xl font-bold mt-6">${pet.pet_name}</h1>
    <div class="flex gap-5 lg:gap-11 mt-4">
        <div>
            <div class="flex gap-2">
                <i class="ri-shapes-line"></i>
                <p>Breed: ${breed}</p>
            </div>
            <div class="flex gap-2">
                <i class="ri-genderless-line"></i>
                <p>Gender: ${gender}</p>
            </div>
            <div class="flex gap-2">
                <i class="ri-genderless-line"></i>
                <p>Vaccinated status: ${vaccine}</p>
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <i class="ri-calendar-line"></i>
                <p>Birth: ${dob}</p>
            </div>
            <div class="flex gap-2">
                <i class="ri-price-tag-2-line"></i>
                <p>Price: ${price} $</p>
            </div>
        </div>
    </div>
    <hr class="my-4">
    <h2 class="font-semibold mb-3">Details Information</h2>
    <p class="">${pet.pet_details}</p>
    `
}
const displayPets = (pets) => {
    const petContainer = document.getElementById("pets")
    petContainer.innerHTML = ""

    if (pets.length == 0) {
        petContainer.classList.remove("grid")
        petContainer.innerHTML = `
        <div class="min-h-[100px] flex flex-col gap-5 justify-center items-center">
            <img class="w-[100px]" src="images/error.webp"/>
            <h1 class="text-lg md:text-xl lg:text-3xl font-bold text-color-1">No Information Available</h1>
            <p class="w-3/4 lg:w-1/2 text-base font-normal text-color-2 text-center">Currently, we don’t have any pets from this category available, but we look forward to offering them in the future!</p>
        </div>`
        return;
    } else {
        petContainer.classList.add("grid")
    }

    pets.forEach(pet => {
        const breed = pet.breed ? pet.breed : "Breed not available"
        const price = pet.price ? pet.price : "Price not available"
        const gender = pet.gender ? pet.gender : "Gender not specified"
        const dob = pet.date_of_birth ? pet.date_of_birth : "Date of birth not available"

        const card = document.createElement("div")
        card.classList = ""
        card.innerHTML = `
        <div class="border rounded-xl p-5">
            <figure class="h-[200px]">
            <img 
            class="h-full w-full object-cover rounded-lg"
            src="${pet.image}"
            alt="Shoes" />
            </figure>
            <div class="px-0 py-2">
                <div>
                    <h2 class="font-bold">${pet.pet_name}</h2>
                    <div class="flex gap-2">
                        <i class="ri-shapes-line"></i>
                        <p>Breed: ${breed}</p>
                    </div>
                    <div class="flex gap-2">
                        <i class="ri-calendar-line"></i>
                        <p>Birth: ${dob}</p>
                    </div>
                    <div class="flex gap-2">
                        <i class="ri-genderless-line"></i>
                        <p>Gender: ${gender}</p>
                    </div>
                    <div class="flex gap-2">
                        <i class="ri-price-tag-2-line"></i>
                        <p>Price: ${price} $</p>
                    </div>
                    <hr class="mt-4">
                    <div class="flex justify-between mt-4">
                        <button class="like-btn text-lg text-color-3 font-bold border border-color-4 rounded-lg py-2 px-4">
                            <i class="ri-thumb-up-line"></i>
                        </button>
                        <button class="adopt-btn text-lg text-color-3 font-bold border border-color-4 rounded-lg py-2 px-4">Adopt</button>
                        <button onclick="loadDetails(${pet.petId})" class="text-lg text-color-3 font-bold border border-color-4 rounded-lg py-2 px-4">Details</button>
                    </div>
                </div>
            </div>
        </div>`
        card.querySelector('.adopt-btn').addEventListener('click', () => {
            adoptPet(card.querySelector('.adopt-btn'))
        })
        card.querySelector('.like-btn').addEventListener('click', () => {
            addLikedPet(pet);
        });

        petContainer.append(card);
    })
}

const addLikedPet = (pet) => {
    const likedPetsContainer = document.getElementById("likedPets")

    const likedCard = document.createElement("div")
    likedCard.classList = "p-2"
    likedCard.innerHTML = `<img src="${pet.image}" class="h-20 w-20 object-cover rounded-md"/>`
    likedPetsContainer.append(likedCard)
}

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories")
    categoryContainer.innerHTML = "";

    categories.forEach(item => {
        const buttonContainer = document.createElement("div")
        buttonContainer.innerHTML = `
        <button class="text-lg lg:text-xl font-bold border rounded-full py-2 lg:py-4 px-4 lg:px-8 border-color-3 category-btn flex justify-center items-center gap-2" id="${item.category}" onclick="loadCategoryPets('${item.category}')">
            <img class="w-[20px] lg:w-[30px]" src="${item.category_icon}"/> ${item.category}
        </button>
        `

        categoryContainer.append(buttonContainer)
    })
}

loadCategories();
loadPets();