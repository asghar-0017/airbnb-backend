let string='javascript'
let firstoccurenceNonRepeatingChar=''
let newString=string.split('')
for(let i=0;i<newString.length;i++){
    if(newString.indexOf(newString[i])===newString.lastIndexOf(newString[i])){
        console.log("newString.indexOf(newString[i]",newString.indexOf(newString[i]))
        console.log("newString.lastIndexOf(newString[i])",newString.lastIndexOf(newString[i]))
        firstoccurenceNonRepeatingChar=newString[i]
        break
    }
}
console.log(firstoccurenceNonRepeatingChar)