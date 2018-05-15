Vagrant.configure("2") do |config|

	config.vm.box = "ubuntu/xenial64"

	config.vm.define "webserver" do |webserver|
		webserver.vm.hostname = "webserver"
		
		webserver.vm.network "forwarded_port", guest: 3000, host: 3000, host_ip: "localhost"
		
		webserver.vm.provider "virtualbox" do |vb|
			# Customize the amount of memory on the VM:
			vb.memory = "1024"
		end
		
		if Vagrant.has_plugin?("vagrant-timezone")
		  webserver.timezone.value = ":host"
		end
		
		webserver.vm.provision :shell, path: "bootstrap-webserver.sh", privileged: false

	end
	

end
