var sumLimit = function(num) {
    var sum = 1, temp = 0;
    while (temp < num){
        temp+=sum;
        sum++;
    }
    return sum;
};