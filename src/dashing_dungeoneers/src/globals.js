export default {
    Scale: 5,
    radBetweenPoint: (x1,y1,x2,y2) => Math.atan2(y2-y1, x2-x1),
    clamp: (val, min, max) => Math.max(Math.min(val, max), min),
    distance: (x1,y1,x2,y2) => Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
    Mu: 0.85,
    Epsilon: 0.01,
    InactiveCursorRadius: Math.pow(64,2)
}