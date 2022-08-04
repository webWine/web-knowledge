# **css——box-sizing**

`box-sizing`用于设置如何计算一个元素的总高度和总宽度

那么如何计算元素的高度与宽度,我们可以回到《css——盒子模型》看看

`box-sizing`可以被用来调整以下两个属性:

1、`content-box`;`box-sizing`的默认属性值,`content`表示如果设置了一个元素的为`100px`,那么元素的内容去宽度就为`100px`,后面再为元素添加的`border`或`padding`将在`content`的基础上增加

计算公式:`实际宽度 = width+padding*2+border*2`

​                        `实际高度 =height+padding*2+border*2 `

2、`border-box`;`border-sizing`表示如果设置了一个元素的`width`为`100px`,那么后面再为元素添加的`padding`或`border`都将在这`width:100px`以内,同时元素的内容区域将会收缩

计算公式: `width = contentWidth+padding*2+border*2`

​               `height = contentHeight+padding*2+border*2`