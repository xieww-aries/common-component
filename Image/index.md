# Image 图片组件

<!-- Auto Replace Content Start -->

## 数据 Data

| 属性             | 类型            | 默认值                       | 必填 | 描述       |
| ---------------- | --------------- | ---------------------------- | ---- | ---------- |
| src              | string \ object | -                            | ✓    | 路径       |
| placeholder      | string          | require('./img/loading.png') | ✗    | 加载兜底图 |
| errorPlaceholder | string          | require('./img/error.png')   | ✗    | 错误兜底图 |

## 功能 Function

| 属性      | 类型 | 默认值 | 必填 | 描述       |
| --------- | ---- | ------ | ---- | ---------- |
| allowLazy | bool | false  | ✗    | 是否懒加载 |

## 类型 Layout

| 属性 | 类型                                                                                                                                                 | 默认值     | 必填 | 描述                                  |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---- | ------------------------------------- |
| mode | rect \ widthFix \ heightFix \ scaletoFill \ aspectFit \ aspectFill \ top \ bottom \ left \ right \ top left \ top right \ bottom left \ bottom right | 'widthFix' | ✗    | 缩放/裁剪模式，具体查看下方 mode 说明 |

## 其他 Other

| 属性    | 类型            | 默认值 | 必填 | 描述     |
| ------- | --------------- | ------ | ---- | -------- |
| size    | string \ number | -      | ✗    | 图片尺寸 |
| quality | string \ number | -      | ✗    | 图片质量 |

## 事件 Event

| 属性        | 类型 | 默认值 | 必填 | 描述         |
| ----------- | ---- | ------ | ---- | ------------ |
| onLoad      | func | -      | ✗    | 加载成功回调 |
| onError     | func | -      | ✗    | 加载错误回调 |
| onExpose    | func | -      | ✗    | 曝光回调     |
| onClickItem | func | -      | ✗    | 点击回调     |

<!-- Auto Replace Content End -->

## 备注

### 🔥 **mode 可选说明**

| 参数         | 缩放 / 裁剪 | 说明                                                        |
| ------------ | ----------- | ----------------------------------------------------------- |
| widthFix     | 缩放模式    | 宽度不变，高度自动变化，保持原图宽高比不变                  |
| heightFix    | 缩放模式    | 高度不变，宽度自动变化，保持原图宽高比不变                  |
| scaletoFill  | 缩放模式    | 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素 |
| aspectFit    | 缩放模式    | 保持纵横比缩放图片，使图片的**长边**能完全显示出来          |
| aspectFill   | 缩放模式    | 保持纵横比缩放图片，只保证图片的**短边**能完全显示出来      |
| rect         | 裁剪模式    | 不缩放图片，宽度与高度相等                                  |
| top          | 裁剪模式    | 不缩放图片，只显示图片的顶部区域                            |
| bottom       | 裁剪模式    | 不缩放图片，只显示图片的底部区域                            |
| left         | 裁剪模式    | 不缩放图片，只显示图片的左边区域                            |
| right        | 裁剪模式    | 不缩放图片，只显示图片的右边区域                            |
| top left     | 裁剪模式    | 不缩放图片，只显示图片的左上角区域                          |
| top right    | 裁剪模式    | 不缩放图片，只显示图片的右上角区域                          |
| bottom left  | 裁剪模式    | 不缩放图片，只显示图片的左下角区域                          |
| bottom right | 裁剪模式    | 不缩放图片，只显示图片的右下角区域                          |

## 用例 Usage

```
//  图片懒加载
<Image allowLazy src="xxxxx" />
```
