goog.require('ThreeDHolder');
goog.provide('ThreeDHolder.updateSlices');



ThreeDHolder.prototype.updateSlices = function() {
    var cvo = this.currentVolObject;
    
    cvo.indexX = Math.round(cvo.indexX);
    cvo.indexY = Math.round(cvo.indexY);
    cvo.indexZ = Math.round(cvo.indexZ);
    
    this.xSlider.setMaximum(cvo._dimensionsRAS[0]-1);
    this.ySlider.setMaximum(cvo._dimensionsRAS[1]-1);
    this.zSlider.setMaximum(cvo._dimensionsRAS[2]-1);
    
    var indexLR = cvo.getIndexOrientation_('sagittal');
    var indexAP = cvo.getIndexOrientation_('coronal');
    var indexIS = cvo.getIndexOrientation_('axial');
    
    this.xSlider.setValue(cvo[indexLR]);
    this.ySlider.setValue(cvo[indexAP]);
    this.zSlider.setValue(cvo[indexIS]);
    
    this.xBox.innerHTML = 'Frame: ' + (cvo[indexLR]) + ' / ' + cvo._dimensionsRAS[0];
    this.yBox.innerHTML = 'Frame: ' + (cvo[indexAP]) + ' / ' + cvo._dimensionsRAS[1];
    this.zBox.innerHTML = 'Frame: ' + (cvo[indexIS]) + ' / ' + cvo._dimensionsRAS[2];
    
};
goog.exportProperty(ThreeDHolder.prototype, 'updateSlices', ThreeDHolder.prototype.updateSlices);
