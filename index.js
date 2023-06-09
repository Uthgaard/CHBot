/////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//  This is a bot which allows players to automatically manage the CH chain       \\
//     with in-game !commands, and then outputs the chain to a discord channel    \\
//     which can then be pasted into game                                         \\
//  There are four commands:                                                      \\
//  !chain start = restarts the chain, clears all assignments                     \\
//  !chain add playername = adds playername to the next position in the chain     \\
//  !chain remove playername = removes playername from the chain                  \\
//     and brings the last person in the chain to their assignment to avoid gaps  \\
//  !chain report = refreshes the chain assignment in discord                     \\
//  The chain will automatically refresh itself in the channel as it is altered   \\
/////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const { Client, GatewayIntentBits } = require('discord.js')
const fs = require('fs')
const readLastLines = require('read-last-lines')
const content = fs.readFileSync('C:/P99/Logs/eqlog_Juisebox_P1999Green.txt', 'utf8')
var order = 0
var tempcount = 0
var tempString = ''
var chain = []
var assignment = []
var padding = ''
var index = 0
var lastOne = 0
var poppedCleric = ''
var chainForDiscord = ''
var instructions = '```How to Use:\n!chain start = Restarts the chain (will also respond to !chain restart)\n!chain add playername = Adds cleric to the end of the chain\n!chain remove playername = Removes cleric from the chain, brings last cleric forward to fill gap\n!chain report = refreshes this channel (useful if display bugs out for any reason)\n\nCurrent Issues Being Solved:\nBot might miss commands issued within 1 second of each other, due to processing time```\n'
var lastMsgID = ''
var commandsToProcess = []
// Live Environment = '1084943396776464464'
// Dev Environment = '1085218184921104466'

require('dotenv/config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('ready', async () => {
    console.log('The bot is ready')
    await client.channels.cache.get('1084943396776464464').bulkDelete(10)

    //client.channels.cache.get('1085218184921104466').send('test')
    //console.log(process.cwd())
    chainForDiscord = instructions + '---- Reporting Current Chain ----\n'
    await client.channels.cache.get('1084943396776464464').send(chainForDiscord).then(sent => {
        lastMsgID = sent.id
        //console.log(lastMsgID)
    })
})


fs.watch('C:/P99/Logs/eqlog_Juisebox_P1999Green.txt', (eventType, filename) => {
    readLastLines.read('C:/P99/Logs/eqlog_Juisebox_P1999Green.txt', 1)
    .then(async (lastLine) => {
        if(lastLine.includes('!chain')){
            commandsToProcess.push(lastLine.trim())
        }
        // Restarts the chain, clears all assignments
        if (lastLine.includes('!chain') && lastLine.includes('start')){
            console.log(lastLine.trim())
            console.log('Restarting chain')
            assignment = []
            tempcount = 0
            order = 0
            chain = []

            chainForDiscord = ''
            chainForDiscord = instructions + '---- Reporting Current Chain ----\n'
            chainForDiscord = chainForDiscord + ''
            // Clear the channel and Update the Chain
            
            await client.channels.cache.get('1084943396776464464').bulkDelete(5)
            await client.channels.cache.get('1084943396776464464').send(chainForDiscord).then(sent => {
                lastMsgID = sent.id
                //console.log(lastMsgID)
            })
        }
        
        // Adds the cleric to the end of the chain if they are not already in it
        if (lastLine.includes('!chain') && lastLine.includes('add')){
            console.log(lastLine.trim())
            tempString = lastLine.toUpperCase().trim().split(/[ ']+/g).slice(-2).slice(0,1).toString()
            
            if(chain.includes(tempString)){
                //console.log(chain.includes(tempString))
                console.log(tempString + ' is already in chain, cleric not added')
            } else {
                chain.push(tempString)
                //console.log(tempString)
                tempcount = 0
                assignment[tempcount] = order
                console.log(assignment)
                order = order + 1
                tempcount = tempcount + 1
                console.log(chain[assignment])

                if (order < 10){
                    padding = '00'
                } else {
                    padding = '0'
                }

                console.log('Adding ' + chain[assignment] + ' to chain in position: ' + padding + order)
                //client.channels.cache.get('1085218184921104466').send(chain[assignment] + ': ' + padding + order + ' ||')
            }

            // Build the chain output for discord         
            index = 0
            chainForDiscord = ''
            chainForDiscord = instructions + '---- Reporting Current Chain ----\n```'
            chain.forEach((element) => {
                console.log(element)
                //console.log(chain.findIndex())
                console.log(index)
                
                if ((index + 1) < 10){
                    padding = '00'
                } else {
                    padding = '0'
                }
                chainForDiscord = chainForDiscord + (element + ': ' + padding + (index + 1) + ' ||\n')
                index = index + 1
            })

            chainForDiscord = chainForDiscord + ' ```'
            // Clear the channel and Update the Chain
            
            await client.channels.cache.get('1084943396776464464').messages.fetch(lastMsgID).then(message => message.delete())
            await client.channels.cache.get('1084943396776464464').send(chainForDiscord).then(sent => {
                lastMsgID = sent.id
                //console.log(lastMsgID)
            })
        }

        // Removes the cleric from chain (if found), and fills the gap
        if (lastLine.includes('!chain') && lastLine.includes('remove')){
            console.log(lastLine.trim())
            tempString = lastLine.toUpperCase().trim().split(/[ ']+/g).slice(-2).slice(0,1).toString()
            console.log(tempString)
            if(chain.includes(tempString)){
                /*
                function checkIndex(tempString){
                    return (chain.includes(tempString))
                }
                */
                index = chain.indexOf(tempString)
                lastOne = (chain.length - 1)
                console.log('Chain goes to ' + (chain.length))
                console.log('Removing ' + tempString + ' from chain position ' + index)
                poppedCleric = chain.pop()
                console.log(poppedCleric + ' removed from chain position ' + lastOne)
                // Moves the last cleric in the chain to the empty spot, AS LONG AS they weren't the cleric being popped off the chain
                if(tempString === poppedCleric){
                } else {
                    chain[index] = poppedCleric
                    console.log('Filling gap - placing ' + poppedCleric + ' in position ' + index)
                }
            }

            // Build the chain output for discord         
            index = 0
            chainForDiscord = ''
            chainForDiscord = instructions + '---- Reporting Current Chain ----\n```'
            chain.forEach((element) => {
                console.log(element)
                //console.log(chain.findIndex())
                console.log(index)
                
                if ((index + 1) < 10){
                    padding = '00'
                } else {
                    padding = '0'
                }
                chainForDiscord = chainForDiscord + (element + ': ' + padding + (index + 1) + ' ||\n')
                index = index + 1
            })

            chainForDiscord = chainForDiscord + ' ```'
            // Clear the channel and Update the Chain
            
            await client.channels.cache.get('1084943396776464464').messages.fetch(lastMsgID).then(message => message.delete())
            await client.channels.cache.get('1084943396776464464').send(chainForDiscord).then(sent => {
                lastMsgID = sent.id
                //console.log(lastMsgID)
            })
        }

        // Reports the chain assignment to discord
        if (lastLine.includes('!chain') && lastLine.includes('report')){
            console.log(lastLine.trim())
            index = 0

            // Build the chain output for discord
            chainForDiscord = instructions + '---- Reporting Current Chain ----\n```'
            chain.forEach((element) => {
                console.log(element)
                //console.log(chain.findIndex())
                console.log(index)
                
                if ((index + 1) < 10){
                    padding = '00'
                } else {
                    padding = '0'
                }
                chainForDiscord = chainForDiscord + (element + ': ' + padding + (index + 1) + ' ||\n')
                index = index + 1
            })

            chainForDiscord = chainForDiscord + ' ```'
            // Clear the channel and Update the Chain
            
            await client.channels.cache.get('1084943396776464464').messages.fetch(lastMsgID).then(message => message.delete())
            await client.channels.cache.get('1084943396776464464').send(chainForDiscord).then(sent => {
                lastMsgID = sent.id
                //console.log(lastMsgID)
            }) 
        }
     })
})

    //console.log(lines)
    //fs.readFile(content, 'utf-8', (err, data) => {
        //let lines = data.trim().split("\n")
        //console.log(lines[lines.length - 1])
        //client.channels.cache.get('1029397799424512092').send(lines)
    //})

    // This deletes the whole channel
    //await client.channels.cache.get('1085218184921104466').delete(lastMsgID)
    // This deletes the specified message
    //client.channels.cache.get('1085218184921104466').messages.fetch(lastMsgID).then(message => message.delete())
/*
do {
        console.log('There is a command to process')
        commandsToProcess.shift()
} while (commandsToProcess.length)
*/

client.login(process.env.TOKEN)