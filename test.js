// const atm=function(initialBalance){
//     let balance=initialBalance;

// import e = require("cors")

//     function withdraw(atm){
//         if(atm>balance){
//             return "Are you Kidding"
//         }else{
//             balance-=atm
//             return balance
//         }
//     }
//     return {withdraw}

// }
// const amount=atm(1000)
// console.log(amount.withdraw(100))



// const checkNumber=arr.includes('mehran')

// if(checkNumber){
//     let arr=["toyota", "mehran"]

// for(let i=0;i<=arr.length;i++){
//     if(arr[i]!='mehran'){
//         i++
//     }
//     if(arr[i]=="mehran"){
//         console.log("Mehran is available")
//         break
//     }else{
//         console.log("Mehran is not avaiable")
        
//     }
// }
// let arr=["toyota", "mehran"]


// arr.forEach((arr)=>{
//     console.log(arr)
//     if(arr==="mehran"){
//                 console.log("Mehran is available")
                
//             }else{
//                 console.log("Mehran is not avaiable")
                
//             }
// })




// for(let i=0;i<check.length;i++){
//     if(check[i]!='mehran'){
//         i++
//     }
//     if(check[i]=='mehran'){
//         console.log("index",i)
//         console.log(check[i])
//     }else{
//         console.log("Mehran Not Available")
//     }
// }



// let string='abx'
// let rev=""
// for(let i=string.length-1;i>=0;i--){
    
//     rev+=string[i]
   
// }
// if(rev==string){
//     console.log("Palindrome")
    
//    }else{
//     console.log("Not a Palindrome")
//    }


// let arr=[1,2,5,2,3,8,22,77,33]
// let secLargest=arr.sort((a,b)=>a-b).at(-2)
// console.log(secLargest)
// let secongLargest=arr.sort((a,b)=>a-b)[arr.length-2]
// console.log(secongLargest)

// let wovel='aeiou'
// let string='abcdefgh'
// let count=0
// let abc=string.split("")
// let wovels=wovel.split("")
// for(let i=0;i<abc.length;i++){
//         for(let j=0;j<wovel.length;j++){
//             if(wovels[j]==string[i]){
//                 count+=1

//             }
//         }
// }
// console.log(count)



// let wovel='aeiou'
// let string='abcdefghi'
// let count=0
// let abcd=string.split("")
// let wovels=wovel.split("")
// for(let i=0;i<abcd.length;i++){
//     for(let j=0;j<wovels.length;j++){
//         if(abcd[i]==wovels[j]){
//             count++
//         }
//     }
// }

// console.log(count)

// let wovel='aeiou'
// let string='abcdefghi'
// let count=0
// let abc=string.split("")
// for(let i=0;i<abc.length;i++){
//    if(wovel.includes(abc[i])){
//     count++
//    }
// }
// console.log(count)



// let wovel='aeiou454dsfaei'
// let wovelArray=wovel.split('')
// let count=0


// for(let i=0;i<wovelArray.length;i++){
//    if(wovelArray[i]=='a' || wovelArray[i]=='e' || wovelArray[i]=='i' || wovelArray[i]=='o' || wovelArray[i]=='u' ){
//     count++
//    }
// }
// console.log(count)


// console.log(abc)

// let num=12343242
// let rev=0
// while(num>0){
//     let remainder=num%10
//     rev=(rev*10)+remainder
//     num=Math.floor(num/10)
// }
// console.log(rev)
//remainder 4
//rev (0*10)+4=4
//num 123432 


// let num=1234
// let rev=0
// while(num>0){
//     let remainder=num%10
//     rev=(rev*10)+remainder
//     num=Math.floor(num/10)
//     console.log(num)
//     console.log(rev)
// } 
// console.log(rev)

// remainder 24

// let checkword={}
// const abc=(str)=>{


// str.split('').forEach(function(el){
//     if(checkword.hasOwnProperty(el)===false){
//         checkword[el]=1
//     }else{
//         checkword[el]++
//     }
//     return checkword

// })
// }  
// console.log(abc("asghar"))



// let num=[1,2,3,4,1,2,55,667,33,77,88,55,33]
// let num=["abc","def","33eee",'dsfdsfsd',"fsdfds","dsfsd","trt"]
// let largestNum=num[0]

// for(let i=0;i<num.length;i++){
//     if(num[i].length>largestNum.length){
//         largestNum=num[i]
//     }

// }
// console.log(largestNum)



// let string='Watch javascript Source on Youtube3333'
// let newNum=string.split(" ")
// let store=newNum[0]
// for(let i=0;i<newNum.length;i++){
//      (newNum[i].length>store.length){
//         store=newNum[i]
//     }
// }
// console.log(store)



// let string="helloljjdlLL"
// let newString=string.split("")
// let count=0
// console.log(newString)
// for(let i=0;i<newString.length;i++){
//     if(string[i]=="l" || string[i]=="L"){
//         count+=1
//     }
// }
// console.log(count)

// let newString=string.split('')
// console.log(newString)
// for(let i=0;i<newString.length;i++){
//     if(newString[i]=='l' || newString[i]=='L'){
//         count++
//     }
// }
// console.log(count)


// let num=5
// let fect=1
// for(let i=1;i<=num;i++){
//     fect=fect*i
    

//     console.log(fect)
// }

// let arr=[1,2,3]
// let average=0
// let total=arr.reduce((previous,current)=>
//      previous+current,0)/arr.length
//     console.log(total)

// let arr=[1,2,3,2,4,5,2]
// let newArr=[...new Set(arr)]
// console.log(newArr)
// let newArray=[...new Set(arr)]
// let arr2=[...new Set(arr)]
// console.log(arr2)

// let arr=[1,2,4,[2,3,4,66],2,3,1,5,6,8,3,9,7,3]
// let copyArr=[...new Set(arr)].flat(Infinity).sort((a,b)=>a-b)
// console.log(copyArr)
// let arrCopy=[...new Set(arr)].sort((a,b)=>a-b).at(-2)
// console.log(arrCopy)



//url encoded
//body parser
//reqq time


// let char='Asghar'
// if(char.toUpperCase()===char){
//     console.log("Upper case")
// }else{
//     console.log("Lower case")
// }

// const removeDuplicate=(num)=>{
//     let num2=(new Set(num))
//     return num2
    
// }
// let num=[1,2,5,3,1,2,3,6,4]
// console.log(removeDuplicate(num))

// const flatendNestedArray=(num)=>{
//     const num2=num.flat(Infinity)
//     return num2
// }

// let num=[[1, 2], [3, 4], [5, 6]]
// console.log(flatendNestedArray(num))


// let largest=[10, 5, 20, 8, 25]
// const secondLargest=largest.sort((a,b)=>a-b).at(-2)
// console.log(secondLargest)

// let arr=[10, 5, 20, 8, 25]
// let largest=arr[0]
// for(let i=0;i<arr.length;i++){
//     if(arr[i]>largest){
//         largest=arr[i]
//     }
// }

// console.log(largest)


// let num=[1, 2, 3, 5, 6,8]
// let missingNumber=[]
// for(let i=0;i<=num.length;i++){
//    let check=i+1
// console.log("check",check)
// console.log("num",num[i])
// if(check!=num[i]){
//     missingNumber.push(check)
//     // i=i-2
//     break
// }
// }
// console.log(missingNumber)


// let num=[1, 2, 3, 5, 6,8]

// let missingNumber=[]
// for(let i=0;i<num.length-1;i++){
//     let current=num[i]
//     let next=num[i+1]

//     console.log("current",current)
//     console.log("next",next)

//     while(next-current>1){
//         missingNumber.push(current+1)
//         current++
//         console.log("Missing Numbers:", missingNumber);
//     }
// }
// console.log("Missing Numbers:", missingNumber);



// let arr1=[1,2,3,4,5]
// let arr2=[6,7,4,3]
// let common=[]
// for(let i=0;i<arr1.length;i++){
//     for(let j=0;j<arr2.length;j++){
//         if(arr1[i]==arr2[j]){
//             common.push(arr1[i])
           
//         }
//     }
// }
// console.log(common)


// let arr=[1, 2, 3, 4, 5, 6, 7, 8, 9]
// let target=10
// let sum=0

// for(let i=0;i<arr.length;i++){
//    for(let j=i+1;j<arr.length;j++){
//     if(arr[i]+arr[j]==target){
//         console.log(arr[i],arr[j])
//     }
//    }
// }

// let num=[5, 7, 7, 8, 8, 10]
// let target=8
// for(let i=0;i<num.length;i++){
//     if(num[i]==target){
//         console.log(i)
//     }
// }


// let arr=[1,2,5,6,7,9]
// let missingNumbers=[]
// for(let i=0;i<arr.length-1;i++){
//     let current=arr[i]//1
//     let next=arr[i+1]//2
//     let check=current+1//2

//     console.log("current",current)//1
//     console.log("next",next)//2
//     console.log("check",check)//2
    

//     while(check!=next){
//         missingNumbers.push(check)
//         check++
// }

// }
// console.log(missingNumbers)



// var a=10;

// (() => {
//     console.log(a);
//     a = 20;
//     console.log(a);
// })();

// console.log(a)


// for(let i=0;i<=5;i++){
//     for(let j=0;j<=5;j++){
//         if(j>4-i){
//             console.log("*")
//         }
        
//     }
//     console.log('/n')
// }
