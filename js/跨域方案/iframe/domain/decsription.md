# 原理
document.domain 可以用来设置当前页面的源
# 方案
将两个不同网页的domain值设置成同一个值，那么浏览器就会认为这两个页面同源，就能实现跨域访问
# 限制
####1、此方案只适用于主域名相同、子域名不相同的跨域场景；
####2、安全性存在缺陷，当一个网站被攻击后，另一个网站会引起漏洞

示例:
```
父窗口
<iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
<script>
    document.domain = 'domain.com';
    var user = 'admin';
</script>
```


```
子窗口
<script>
    document.domain = 'domain.com';
    // 获取父窗口中变量
    alert('get js data from parent ---> ' + window.parent.user);
</script>
```