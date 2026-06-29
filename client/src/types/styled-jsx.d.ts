import 'react';

// 支持页面内 <style jsx> / <style jsx global> 写法（styled-jsx），
// 与 4/5 月页面保持一致的类型定义。
declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
