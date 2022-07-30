//Select element
let countSpan=document.querySelector(".quiz-info .count span");
let bulletSpanContainer=document.querySelector(".bullets .spans");
let quizArea=document.querySelector(".quiz-area");
let answersArea=document.querySelector(".answers-area");
let submitButton=document.querySelector(".submit");
let bullets=document.querySelector(".bullets");
let resultsContainer=document.querySelector(".results");
let countDownSpan=document.querySelector(".countdown");

//set options
let currentIndex=0;
let rightAnswer=0;
let countdownInterval=0;
function getQuestion(){
    let myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange=function(){
        if(this.readyState===4 && this.status===200){
            
            let questionObject=JSON.parse(this.responseText);
            let questionsCount=questionObject.length;
            console.log(questionsCount);
            //create bullets+ set question count
            createBullets(questionsCount);
            //add question Data
            addQuestionData(questionObject[currentIndex],questionsCount);
            //start count down
            countDown(60,questionsCount);
            //click on submit
            submitButton.onclick=()=>{
                //get right answer
                let theRightAnswer=questionObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(theRightAnswer,questionsCount);
                //Remove Previous Question
                quizArea.innerHTML=" ";
                answersArea.innerHTML=" ";
            addQuestionData(questionObject[currentIndex],questionsCount);
            //handel bullets class
            handelBullets();

            clearInterval(countdownInterval);
            countDown(60,questionsCount);

            //show results
            showResults(questionsCount);



            };
        }
    }
    myRequest.open("GET","html-question.json",true);
    myRequest.send();
}
getQuestion();

function createBullets(num){
    countSpan.innerHTML=num;
    //create spans
    for(let i=0;i<num;i++){
        let theBulllet=document.createElement("span");
        //check if its first span
        if(i===0){
            theBulllet.className="on";

        }
        //append to main bullete container
        bulletSpanContainer.appendChild(theBulllet);

    }
}
function addQuestionData(obj,count){
if(currentIndex<count){
    
    let questionTitle=document.createElement("h2");
    //create question text
    let questionText=document.createTextNode(obj['title']);
    //append Text To H2
    questionTitle.appendChild(questionText);

    //append h2 to quiz area
    quizArea.appendChild(questionTitle);

    for(let i=1; i<=4; i++){
        //create main answer Div
        let mainDiv=document.createElement("div");
        mainDiv.className='answer';
        //create radio input
        let radioInput=document.createElement("input");
        //add type +name +id+ attribute
        radioInput.name='question';
        radioInput.type='radio';
        radioInput.id=`answer_${i}`;
        radioInput.dataset.answer=obj[`answer_${i}`];
        //make first option selected
        if(i===1){
            radioInput.checked=true;
        }
        let theLabel=document.createElement('label');
        theLabel.htmlFor=`answer_${i}`;
        //create label text
        let theLabelText=document.createTextNode(obj[`answer_${i}`]);
        //add the text to the label
        theLabel.appendChild(theLabelText);
        //add label+input to main Div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        answersArea.appendChild(mainDiv);

    }

}

}
function checkAnswer(rAnswer,count){
    
    let answers=document.getElementsByName("question");
    let choosenAnswer;
    for(let i=0; i<answers.length; i++){
        if(answers[i].checked){
            choosenAnswer=answers[i].dataset.answer;

        }
    }
    if(rAnswer===choosenAnswer){
        rightAnswer++;
        console.log("GOOD");
    }
}
function handelBullets(){
    let bulletsSpans=document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans=Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndex==index){
            span.className="on";
        }
    })
}
function showResults(count){
    let theResults;
    if(currentIndex===count){
        console.log("Questions is finished");
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswer>(count/2) && rightAnswer<count){
            theResults=`<span class="good">Good</span>,You Answered ${rightAnswer} from ${count}`;
        }else if(rightAnswer===count){
            theResults=`<span class="perfect">Perfect</span> All answers is good`;
        }else{
            theResults=`<span class="bad">Bad</span> You Answered ${rightAnswer} from ${count}`;

        }
        resultsContainer.innerHTML=theResults;
        resultsContainer.style.padding='10px';
        resultsContainer.style.backgroundColor="white";
        resultsContainer.style.marginTop='10px';
    }

}
function countDown(duration,count){
    if(currentIndex<count){
        let minutes,seconds;
        countdownInterval=setInterval(function(){
            minutes=parseInt(duration/60);
            seconds=parseInt(duration%60);
            minutes=minutes<10? `0${minutes}` : minutes;
            seconds=seconds<10? `0${seconds}` : seconds;


            countDownSpan.innerHTML=`${minutes}:${seconds}`;
            if(--duration<0){
                clearInterval(countdownInterval);
                submitButton.click();
            }
        },1000);

    }
}
