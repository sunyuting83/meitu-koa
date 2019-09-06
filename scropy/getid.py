# -*- coding:utf-8 -*-
import sys, commands

def makeUrl():
	try:
		for i in range(19018):
			if i > 0:
				# print(i)
				yield i
	except Exception as e:
		print(e)

def startApp():
	url = makeUrl()
	while True:
		try:
			dk = '%s%s' % ('node getid ',next(url))
			try:
				(status, output) = commands.getstatusoutput(dk)
				print(output)
			except Exception as e:
				print (e)
		except StopIteration:
			sys.exit()
		except Exception as e:
			pass
			sys.close()
	

if __name__ == '__main__':	
	startApp()

