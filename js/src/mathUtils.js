/* for a given @limit, finds the minimum @n such that
 * the summation @temp from 1 to n does not
 * exceed that limit
 */
var sumLimit = function(limit) {
    var n = 1, temp = 0;
    while (temp < limit){
        temp+=n;
        n++;
    }
    return n;
};

var arcLength = function(j, jLen, scale) {
    /*
     *   arc length = theta*r (radians)    = alpha*pi*r/180 (degrees)
     *        alpha = degree of separation = j/jLen
     *            r = radius               = scale/2
     *     splitInd = hemispheric index;
     *                the cubes are arranged ' ... jLen-1 <-> jLen <-> 0 <-> 1 ... '
     *                for j > jLen, the range of j-jLen is -(1) to -(jLen/2.0)
     */
    var splitInd = j <= (jLen/2.0) ? j : Math.abs(j-jLen);
    return (360./(splitInd/jLen)*Math.PI*(scale/2.0))/180.0;
};

var randomizer = function(scalar, center){
    scalar = scalar || 1;
    center = center || 0;
    return Math.sqrt(Math.random()*scalar +.00001) - center;
};

var dampen = function(scale) {
    return Math.log(Math.pow(scale,4)) > 0.5 ? Math.log(Math.pow(scale,4)) : 0.5;
};

var smoothen= function(current, last){
    last = last || 0;
    var smooth = current - last;
    /* smoothScale = normalization between previous and current vals
     * smoothScale = smoothScale^2/3
     */
    return smooth >  1  ? Math.pow(smooth, 2/3) :
           smooth >= 0  ? smooth : -1.0*Math.pow(Math.abs(smooth), 2/3);
};