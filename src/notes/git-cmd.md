# Git常用命令

## 提交
- 提交
```sh
# 先使用 add 添加到暂存区
git commit -m ${message}
# add 和 commit一步到位
git commit -a -m ${message}
```
- 修改提交信息
```sh
git commit --amend -m ${message}
```
- 查看一次提交的详细信息
```sh
# 默认最后一次提交
git show 
# 指定的提交的ID，可以同时指定此次提交中修改的文件
git show ${commit-id} [${filename}]
```

## 分支
- 列出所有分支
```sh
git branch
```
- 切换分支
```sh
git checkout ${branch-name}
# or
git switch ${branch-name} # 新版本git提供
```
- 创建并切换到新的分支
```sh
git checkout -b ${branch-name}
# or
git switch -c ${branch-name} # 新版本git提供
```
- 删除分支
```sh
git branch -d ${branch-name}
# 使用 -D 可强行删除
```
- 设置上游分支
```sh
git branch --set-upstream-to=${origin-rep-name}/${origin-branch} ${local-branch}
```

## 合并
- 合并指定分支到当前分支
```sh
git merge ${branch-name}
```
- 禁用`Fast forward`模式进行合并
```sh
#因为使用 --no-ff 方式合并会创建一个新commit，所以需要commit message
git merge --no-ff -m ${message} ${branch-name}
```

## 变基
```sh
git rebase
```

## 标签
- 创建标签
```sh
# 不指定commit-id，默认将标签打在当前分支的最新 commit 上
git tag ${tag-name} [${commit-id}]
# 创建带有说明的标签，用-a指定标签名，-m指定说明文字
git tag -a ${tag-name} -m ${message} ${commit-id}
```
- 删除标签
```sh
git tag -d ${tag-name}
```
- 查看标签信息
```sh
git show ${tagname}
```
- 查看所有标签
```sh
git tag
```
- 推送标签
```sh
# 推送指定标签
git push origin ${tag-name}
# 一次性推送全部尚未推送到远程的本地标签
git push origin --tags
```

## 撤销与回滚
- **回滚**
```sh
git reset [--hard|--soft|--mixed] ${commit-id}
# --hard: 回退到上个版本的已提交状态
# --soft: 回退到上个版本的未提交状态
# --mixed: 回退到上个版本已添加但未提交的状态
```
- 把暂存区的修改撤销掉（`unstage`），重新放回工作区
```sh
git reset HEAD ${file}
```
- **回滚修改**：让这个文件回到最近一次 `git commit` 或 `git add` 时的状态
```sh
git checkout -- ${file-name}
```
- **撤销**
```sh
git revert -n ${commit-id}
# 若有以下提交记录，使用 git revert -n 6cbf16b 可以撤销 6cbf16b 提交的内容，但保留 4230067 的内容
# * 4230067 (HEAD -> main) Revert "modified eighth"
# * 6cbf16b hahahaha eighth
# * 65ab06b modified eighth
# * 23d71ad eighth.txt
# * 563f932 revert
```

## 拉取

## 远程仓库
- 查看当前仓库关联的远程仓库
```sh
git remote
```
- 查看远程仓库信息
```sh
git remote -v
```
- 添加远程仓库
```sh
git remote add ${rep-name} ${rep-url}
```
- 删除远程仓库
```sh
git remote rm ${rep-name}
```
- 查看更多的信息
```sh
git remote show ${rep-name}
```

## 配置
- 配置用户名和邮箱
```sh
# 修改当前仓库的用户名和邮箱
git config user.name ${user.name}
git config user.email ${user.email}

# 修改全局的用户名和邮箱
git config --global user.name ${user.name}
git config --global user.email ${user.email}
```
- 命令别名
```sh
git config --global alias.${alias} ${actual-cmd}
```

## 其他常用命令
- 查看文件修改前后的差异
```sh
git diff ${file-name}
```
- 查看当前仓库状态
```sh
git status
```
- 查看提交日志
```sh
git log [--graph|--oneline|--all] 
# --graph 命令可以看到分支合并图
# --all 查看所有分支
# --oneline 每次提交只显示一行
```
- 查看历史命令
```sh
git reflog
```

## .gitignore
- 一个`Git`仓库也可以有多个`.gitignore`文件，`.gitignore`文件放在哪个目录下，就对哪个目录（包括子目录）起作用
- 把指定文件排除在`.gitignore`规则外的写法就是`!+文件名`
- 检查文件因为那句代码被排除
```sh
git check-ignore -v ${filename}$
```

## 参考资料
- [GIT教程---廖雪峰的官方网站](https://liaoxuefeng.com/books/git/introduction/index.html)

## 附件
- [Git Cheat Sheet](/git-cheat-sheet.pdf)
  