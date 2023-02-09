const banner = document.querySelector("#banner"); 
const list = document.querySelector(".list"); 
 
const prev = banner.querySelector(".prev"); 
const next = banner.querySelector(".next"); 
let num = 0; 
let wid = 0; 
let timer; //setInterval 함수의 아이디 설정 
let enableClick = true; 

//fetch구문으로 데이터호출 함수 호출 
createList("data.json");

//move함수를 0.05초마다 호출하여 앞으로 이동하는 모션 실행 
timer = setInterval(move, 50);


//이미지를 클릭했을 때 - html문서에 이미 있는 요소 list에 이벤트위임 
list.addEventListener("click", e=>{
	e.preventDefault(); 
	//console.log(e.currentTarget); //이벤트바인딩된 대상 list 
	//console.log(e.target); //내가 클릭한 실제 요소 - 제일 하위요소 img

	//클릭한 요소의 부모a 의 href값 구해서 변수로 저장 
	let imgSrc = e.target.parentElement.getAttribute("href"); 
	
	createPop(imgSrc); 	
});

//pop의 close(span) 클릭했을 때 - body에 이벤트 위임 
document.body.addEventListener("click", e=>{
	removePop(e); 
})


//배너에 마우스엔터했을 때 
banner.addEventListener("mouseenter", ()=>{
	clearInterval(timer); 	
}); 

banner.addEventListener("mouseleave", ()=>{
	timer = setInterval(move, 50);
}); 

prev.addEventListener("click",e=>{
	e.preventDefault(); 

	if(enableClick){
		prevEl(); 
		enableClick = false; 
	}
	
	
});

next.addEventListener("click",e=>{
	e.preventDefault(); 
	if(enableClick){
		nextEl();
		enableClick = false; 
	}
	 	
});

//prev 버튼 클릭 이벤트 함수 정의 
function prevEl(){
	new Anim(list, {
		prop:"margin-left", 
		value : 0, 
		duration:500, 
		callback:()=>{
			list.style.marginLeft = -wid+"px"; 
			list.prepend(list.lastElementChild); 
			enableClick = true; 
		}
	})
}

//next 버튼 클릭 이벤트 함수 정의 
function nextEl(){
	new Anim(list,{
		prop:"margin-left", 
		value : -wid *2, 
		duration:500,
		callback:()=>{
			list.style.marginLeft = -wid+"px"; 
			list.append(list.firstElementChild); 
			enableClick = true; 
		}
	})
}


function createList(url){
	fetch(url) //데이터를 요청 
	.then(data =>{     //데이터 수신   
		//console.log(data)
		return data.json(); 
		//.json()메소드를 사용해서 json형식으로 데이터 받아옴 
	})
	.then(json =>{ //받아온 데이터를 화면에 배치 
		 let items = json.imgSrc; 
		  console.log(items); 
	
		  let tags = ""; 
	
		  items.forEach(item=>{
			 tags+=`
				 <li>
					<a href="${item.pic}">
						<img src="${item.thumb}">
					</a>
				</li>
			 `; 
		  }); 
		  //반복을 돌면 tags에 쌓인 문자열을 list에 대입 
		  list.innerHTML = tags; 
	
		  initList();  	  
	})
	.catch(err=>{
		console.error("데이터를 호출하는데 실패했습니다")
	})
}

function initList(){
	//ul 스타일 제어 
		  //생성된 li를 탐색하여 변수로 저장 
		  const list_li = list.querySelectorAll("li"); 
		  const len = list_li.length; //li갯수 구하기 
		  //li한개의 너비값을 구해서 - 숫자로 변환 
		  //전역변수로 바꿔서 이미 선언된 wid에 값 대입 
		  wid = parseInt(getComputedStyle(list_li[0]).width); 
		  //부모요소 ul의 너비값은  li의 너비 * 갯수 
		  list.style.width = len * wid +"px"; 
		  //prev버튼이 있으므로 요소하나를 앞으로 보냄 
		  list.style.marginLeft = -wid +"px";
		  //마지막 요소를 앞으로 보내서 화면에 첫번째 li가 보이도록  
		  list.prepend(list.lastElementChild); 
	}

function move(){
	//margin-left 초기값 -240 
	//num값이 -480이 되면 li 하나가 앞으로 이동 - 화면에서 사라짐 
	//맨앞의 li를 list 의 끝쪽으로 보냄 
    //wid변수는 initList함수내에서 초기에 설정했던 값이라 
	//wid를 전역변수로 만들어 두 함수에 사용
	if(num < -wid *2){
		num = -wid; 
		list.append(list.firstElementChild); 
	}else{
		num-=2; 
	}	
	list.style.marginLeft = num +"px"; 
}
 

function createPop(imgSrc){
	//aside 태그 새로 생성 
	const pop = document.createElement("aside"); 
	pop.classList.add("pop"); //aside에 클래서 pop 추가 
	//pop에 컨텐츠 동적으로 넣기  
	pop.innerHTML = `
					<div class="pic">
						<img src="${imgSrc}">
					</div>
					<span>CLOSE</span>
	`; 

	//바디에 pop 삽입 
	document.body.append(pop); 

	new Anim(pop,{
		prop:"opacity", 
		value :1, 
		duration:500
	})
}

function removePop(e){
	//pop을 찾아서 변수로 저장 
	const pop = document.querySelector(".pop"); 
	//pop이 있을 때에만 
	if(pop){
		//close를 찾아서 변수로 저장 
		const close = pop.querySelector("span"); 

		//클릭한 대상이 close와 같다면 
		if(e.target == close){
			//opacity값 먼저 적용하고 pop제거 - fadeOut효과 
			new Anim(pop,{
				prop:"opacity", 
				value:0, 
				duration:500, 
				callback:()=>{
					pop.remove();  //pop을 제거 
				}
			})

			
		}
	}

}




