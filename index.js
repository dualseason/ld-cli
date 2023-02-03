#!/usr/bin/env node
const chalk = require('chalk')
const fs = require('fs')
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const symbols = require('log-symbols')
const handlebars = require('handlebars')

let templates = {
    'EndBase': {
        url: 'https://github.com/dualseason/Project_koa.git',

    }
}

program
    .version(require('./package').version, '-v, --version')
    .command('list')
    .description('查看所有可用的项目模板')
    .action(() => {
        console.log(
            rimrafchalk.green('1. KoaEnd') + '\n'+
            chalk.red('2. ReactWeb') + '\n'+
            chalk.blue('3. ReactH5') + '\n'
        )
    })

program
    .command('init <ProjectName>')
    .action(name => {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'author',
                    message: '请输入你的名字'
                }
            ])
            .then(answers => {
                const ldProcess = ora('正在创建...')
                ldProcess.start()
                download(
                    'direct:https://github.com/dualseason/Project_koa.git',
                    name,
                    { clone: true },
                    err => {
                        if (err) {
                            ldProcess.fail()
                            console.log(symbols.error, chalk.red(err))
                        } else {
                            ldProcess.succeed()
                            const fileName = `${name}/package.json`
                            const meta = {
                                name,
                                author: answers.author
                            }
                            if (fs.existsSync(fileName)) {
                                const content = fs.readFileSync(fileName).toString()
                                const result = handlebars.compile(content)(meta)
                                fs.writeFileSync(fileName, result)
                            }
                            console.log(symbols.success, chalk.green('创建成功'))
                        }
                    }
                )
            })
    })

program.parse(process.argv)
