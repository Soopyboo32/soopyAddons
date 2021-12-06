/// <reference types="../CTAutocomplete/asm" />
/// <reference lib="es2015" />

/**@param {IASM} ASM */
/*
export default ASM => {
    const {desc, L} = ASM;

    // const RENDER_ITEM = "net.minecraft.client.renderer.entity.RenderItem"

    // ASM.injectBuilder(
    //     RENDER_ITEM,
    //     "func_175042_a",
    //     desc("V", "net/minecraft/item/ItemStack" |> L,"I","I"),
    //     ASM.At(ASM.At.HEAD)
    // ).methodMaps({
    //     "renderItemIntoGUI": "func_175042_a"
    // }).instructions($ => {
    //     $.invokeJS("f1");
    // }).execute();


    ASM.injectBuilder(
        'net/minecraft/client/renderer/entity/RenderItem',
        'renderItemIntoGUI',
        desc("V", L("net/minecraft/item/ItemStack"),"I","I"),
        ASM.At(ASM.At.HEAD)
    ).methodMaps({
        "renderItemIntoGUI": "func_175042_a"
    }).instructions($ => { 
        $.invokeJS("f1");
    })
     .execute()
}

// "asmEntry": "asm.js",
// "asmExposedFunctions": {
//     "f1": "f1.js"
// }