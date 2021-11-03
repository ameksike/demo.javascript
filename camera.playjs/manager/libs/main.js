/**
 *
 * @package: app
 * @version: 0.1

 * @description: Ejemplo de como utilizar un visor de camaras 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 04/11/2011
 * @making-Date: 25/11/2011
 * @license: GPL v3
 *
 */
Ext.QuickTips.init();
Ext.onReady(function(){
    
    Ext.Ajax.request({
        url: 'read',
        success: function(opt,result){
            var options=Ext.decode(opt.responseText);
            var visor = new CenterCameraConfig(options);
            visor.show();
        },
        failure: function(opt,result){
           console.info(opt)
        }
    });
});
